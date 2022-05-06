import { Request, Response } from 'express';
import { IUsersService } from '../utils/interfaces/services.interfaces';
import { processError } from '../utils/helpers';

export default class UserController {
  constructor(private usersService: IUsersService) {
    this.usersService = usersService;
  }

  async create(req: Request, res: Response): Promise<void | Response> {
    try {
      const user = await this.usersService.create(req.body);
      return res.send({
        user
      });
    } catch (err) {
      return processError(res, err);
    }
  }

  async authUser(req: Request, res: Response): Promise<void | Response > {
    try {
      const { email, password } = req.body;
      const { accessToken, user } = await this.usersService.auth({ email, password });
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
  }

  async getUser(req: Request, res: Response): Promise<void | Response> {
    try {
      const { userId } = req.params;
      const user = await this.usersService.getOne(userId);
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
}
