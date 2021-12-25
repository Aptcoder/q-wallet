import { Request, Response } from 'express';
import { processError } from '../utils/helpers';
import UserService from '../services/user.service';

export default {
  async create(req: Request, res: Response): Promise<void | Response> {
    try {
      const userService = new UserService();
      const user = await userService.create(req.body);
      return res.send({
        user
      });
    } catch (err) {
      console.log('err', err);
      return res.status(500).send(err);
    }
  },

  async authUser(req: Request, res: Response): Promise<void | Response > {
    try {
      const { email, password } = req.body;
      const userService = new UserService();
      const { accessToken, user } = await userService.authUser(email, password);
      return res.send({
        status: 'success',
        message: 'User auth successful',
        data: {
          token: accessToken,
          user
        }
      });
    } catch (err) {
      return processError(res, err);
    }
  },

  async getUser(req: Request, res: Response): Promise<void | Response> {
    try {
      const { userId } = req.params;
      const userService = new UserService();
      const user = await userService.getUser(userId);
      if (!user) {
        return res.status(404).send({
          message: 'User not found'
        });
      }
      return res.send({ user });
    } catch (err) {
      console.log('err', err);
      return res.status(500).send(err);
    }
  }
};
