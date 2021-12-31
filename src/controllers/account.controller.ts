/* eslint-disable camelcase */
import { Response } from 'express';
import AccountService from '../services/account.services';
import { processError } from '../utils/helpers';
import { reqWithUser } from '../utils/types';

export default {
  async makeTransfer(req: reqWithUser, res: Response): Promise<void | Response> {
    try {
      const { email, amount } = req.body;
      const { email: userEmail } = req.user;
      const accountService = new AccountService();
      const result = await accountService.Transfer(
        email,
        userEmail,
        amount,
        'Take am do christman'
      );

      return res.send({
        message: 'Transfer successful',
        data: {
          balance: result.balance
        }
      });
    } catch (err: any) {
      return processError(res, err);
    }
  },

  async initiateCardFunding(req: reqWithUser, res: Response) {
    try {
      const {
        amount, cvv, card_number, expiry_month, expiry_year
      } = req.body;
      const { email: userEmail } = req.user;
      const accountService = new AccountService();
      const result = await accountService.initiateCardFunding(
        userEmail,
        {
          cvv,
          card_number,
          expiry_month,
          expiry_year
        },
        amount
      );
      return res.send({
        message: result.message,
        data: {
          result
        }
      });
    } catch (err: any) {
      console.log(err);
      return processError(res, err);
    }
  }
};
