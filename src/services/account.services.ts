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

  public async initiateCardFunding(
    userEmail: string,
    card: {
      cvv: string,
      card_number: string,
      expiry_month: string,
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
    console.log('trans', randRef);
    const payload = {
      ...card,
      tx_ref: randRef,
      fullname: `${user.firstName} ${user.lastName}`,
      email: user.email,
      amount
    };
    const result = await paymentService.initiateCardPayment(payload);
    if (result.status !== 'success') {
      throw new ServiceError({ status: 400, message: 'Could not complete card transaction' });
    }

    const nextStage = result.meta.authorization.mode;
    if (nextStage !== 'pin') {
      throw new ServiceError({ status: 400, message: 'Can not charge this card' });
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

    await this.connection.getRepository(Transaction).save(transaction);
    return result;
  }

  public static async creditAccount(
    account: Account,
    creditAmount: number,
    transactionDetails: { narration: string, category: TransactionCategory },
    manager: EntityManager
  ) {
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
    console.log('transacgion cre', transaction);
    await manager.update(
      Account,
      { id: account.id },
      {
        balance: account.balance + creditAmount
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
transactionDetails,
manager
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
