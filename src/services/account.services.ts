import { getConnection, EntityManager } from 'typeorm';
import { randomUUID } from 'crypto';
import paymentService from '../utils/payment.service';
import Account from '../entities/account.entity';
import User from '../entities/user.entity';
import Transaction, { TransactionType, TransactionCategory } from '../entities/transaction.entity';
import ServiceError from '../utils/service.error';

export default class AccountService {
  private connection;

  constructor() {
    this.connection = getConnection('q-wallet');
  }

  private static processCardPaymentResult(result: any) {
    if (result.status !== 'success') {
      return {
        creditAccount: false,
        success: false,
        nextAction: 'Could not charge card',
        status: 'FAILED'
      };
    }

    // is the next stage to submit otp;
    if (result.meta) {
      const { authorization } = result.meta;
      const { mode } = authorization;
      console.log('autho', mode);
      if (mode === 'otp') {
        return {
          creditAccount: false,
          success: true,
          nextAction: 'Submit OTP',
          status: 'SUBMIT_OTP'
        };
      }
      if (mode === 'pin') {
        return {
          creditAccount: false,
          success: true,
          nextAction: 'Submit PIN',
          status: 'PIN_REQUIRED'
        };
      }
    }

    if (result.data) {
      const { status } = result.data;
      if (status === 'successful') {
        return {
          creditAccount: true,
          success: true,
          nextAction: 'Credit Account',
          status: 'COMPLETED'
        };
      }
    }

    return {
      creditAccount: false,
      success: false,
      nextAction: 'Could not charge card',
      status: 'FAILED'
    };
  }

  public async getBalance(
    userEmail: string
  ) {
    const user = await this.connection.getRepository(User).findOne({
      where: {
        email: userEmail
      },
      select: ['account', 'phoneNumber', 'firstName', 'lastName', 'id', 'email'],
      relations: ['account']
    });
    if (!user) {
      throw new ServiceError({ message: 'User not found', status: 404 });
    }

    return user.account.balance;
  }

  public async initiateCardFunding(
    userEmail: string,
    card: {
      cvv: string,
      card_number: string,
      expiry_month: string,
      pin: string,
      expiry_year: string
    },
    amount: number
  ) {
    const user = await this.connection.getRepository(User).findOne({
      where: {
        email: userEmail
      }
    });

    if (!user) {
      throw new ServiceError({ status: 404, message: 'User not found ' });
    }

    const account = await this.connection.getRepository(Account).findOne({
      where: {
        user: user.id
      }
    });

    if (!account) {
      throw new ServiceError({ status: 404, message: 'Account not found ' });
    }
    const randRef = randomUUID();
    const payload = {
      ...card,
      tx_ref: randRef,
      fullname: `${user.firstName} ${user.lastName}`,
      email: user.email,
      amount
    };
    const result = await paymentService.initiateCardPayment(payload);
    const processedResult = AccountService.processCardPaymentResult(result);
    if (!processedResult.success) {
      throw new ServiceError({ status: 400, message: processedResult.nextAction as string });
    }

    if (processedResult.nextAction === 'Submit PIN') {
      return {
        message: 'Submit card pin to continue',
        status: processedResult.status
      };
    }

    const transaction = new Transaction();
    transaction.category = TransactionCategory.CARD_FUNDING;
    transaction.narration = 'CARDFD_';
    transaction.amount = amount;
    transaction.balance_before = account.balance;
    transaction.balance_after = account.balance + Number(amount);
    transaction.account = account;
    transaction.type = TransactionType.CREDIT;
    transaction.meta_data = JSON.stringify({
      response: result.message
    });
    transaction.reference = randRef;
    transaction.ext_reference = (result.data ? result.data.flw_ref : null) as string;
    transaction.last_ext_response = (result.data ? result.data.status : 'pending') as string;

    await this.connection.getRepository(Transaction).save(transaction);

    return {
      message: processedResult.nextAction,
      status: processedResult.status,
      data: {
        transaction
      }
    };
  }

  public async validateFunding(txRef: string, otp: string, user: any) {
    const { accountId } = user;
    const transaction = await this.connection.getRepository(Transaction).findOne({
      where: {
        reference: txRef,
        account: accountId
      },
      relations: ['account']
    });

    if (!transaction) {
      throw new ServiceError({ status: 404, message: 'Transaction not found ' });
    }
    const result = await paymentService.validateCharge(transaction.ext_reference, otp);
    if (result.status !== 'success') {
      throw new ServiceError({ status: 400, message: 'Could not validate charge' });
    }

    await this.connection.getRepository(Transaction).update({
      reference: transaction.reference
    }, {
      last_ext_response: result.data.status as string
    });

    await this.connection.transaction(async (manager) => {
      await manager.update(Transaction, {
        reference: transaction.reference
      }, {
        last_ext_response: result.data.status as string
      });

      await AccountService.creditAccount(
        transaction.account,
        transaction.amount,
        manager
      );
    });

    return {
      message: 'Charge completed',
      data: {
        transaction
      }
    };
  }

  public static async creditAccount(
    account: Account,
    creditAmount: number,
    manager: EntityManager,
    transactionDetails: { narration: string, category: TransactionCategory } | undefined = undefined
  ) {
    if (transactionDetails) {
      const transaction = new Transaction();
      transaction.amount = creditAmount;
      transaction.type = TransactionType.CREDIT;
      transaction.category = transactionDetails.category;
      transaction.account = account;
      transaction.balance_after = account.balance + creditAmount;
      transaction.balance_before = account.balance;
      transaction.narration = transactionDetails.narration;
      transaction.meta_data = transaction.narration;

      await manager.save(Transaction, transaction);
    }

    await manager.update(
      Account,
      { id: account.id },
      {
        balance: account.balance + Number(creditAmount)
      }
    );
  }

  public static async debitAccount(
    account: Account,
    debitAmount: number,
    transactionDetails: { narration: string, category: TransactionCategory },
    manager: EntityManager
  ) {
    if (account.balance < debitAmount) {
      throw new ServiceError({ message: 'Insufficient balance', status: 400 });
    }
    const transaction = new Transaction();
    transaction.amount = debitAmount;
    transaction.type = TransactionType.DEBIT;
    transaction.category = transactionDetails.category;
    transaction.account = account;
    transaction.balance_after = account.balance - debitAmount;
    transaction.balance_before = account.balance;
    transaction.narration = transactionDetails.narration;
    transaction.meta_data = transaction.narration;

    await manager.save(Transaction, transaction);
    console.log('transacgion', transaction);
    await manager.update(
      Account,
      { id: account.id },
      {
        balance: account.balance - debitAmount
      }
    );
  }

  public async Transfer<Type extends {email: string }>(
    creditUserEmail: Type,
    debitUserEmail: Type,
    amount: number,
    narration: string
  ) {
    const accountRepo = this.connection.getRepository(Account);
    const userRepo = this.connection.getRepository(User);

    const creditUser: User | undefined = await userRepo.findOne({
      where: {
        email: creditUserEmail
      }
    });
    if (!creditUser) {
      throw new ServiceError({ message: 'Credit user not found', status: 404 });
    }
    const creditAccount = await accountRepo.findOne({
      where: { user: creditUser.id }
    });

    const debitUser: User | undefined = await userRepo.findOne({
      where: {
        email: debitUserEmail
      }
    });
    if (!debitUser) {
      throw new ServiceError({ message: 'Debit user not found', status: 404 });
    }
    const debitAccount = await accountRepo.findOne({
      where: { user: debitUser.id }
    });

    await this.connection.transaction(async (manager) => {
      const transactionDetails = {
        narration,
        category: TransactionCategory.WALLET_TRANSFER,
      };
      await AccountService.creditAccount(
creditAccount as Account,
amount,
manager,
transactionDetails,
      );
      await AccountService.debitAccount(
debitAccount as Account,
amount,
transactionDetails,
manager
      );
    });

    return {
      balance: debitAccount!.balance - amount,
    };
  }
}
