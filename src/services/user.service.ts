/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { getConnection } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import ServiceError from '../utils/service.error';
import User from '../entities/user.entity';
import Account from '../entities/account.entity';

interface UserDataInterface {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string
}

export default class UserService {
  public userRepo;

  constructor() {
    this.userRepo = getConnection('q-wallet').getRepository(User);
  }

  public async create(userData: UserDataInterface) {
    const hashedPassword = await UserService._hashPassword(userData.password);
    const user = new User();
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.password = hashedPassword;
    user.phoneNumber = userData.phoneNumber;

    const account = new Account();
    user.account = account;
    this.userRepo.save(user);
    return user;
  }

  public async authUser(userEmail: string, userPassword: string) {
    const user = await this.userRepo.findOne({
      where: {
        email: userEmail
      }
    });

    if (!user) {
      throw new ServiceError({ message: 'User not found', status: 404 });
    }

    const comparePasswordResult = UserService._comparePassword(userPassword, user.password);
    if (!comparePasswordResult) {
      throw new ServiceError({ message: 'Incorrect password', status: 401 });
    }

    const { accessToken } = await UserService._generateToken(user);
    return { accessToken, user };
  }

  public async getUser(userId: string) {
    const user = await this.userRepo.findOne(userId, {
      select: ['firstName', 'lastName', 'id', 'email', 'account', 'phoneNumber'],
      relations: ['account']
    });
    return user;
  }

  private static async _hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private static async _comparePassword(enteredPassword: string, password: string) {
    return bcrypt.compare(enteredPassword, password);
  }

  private static async _generateToken(user: User):Promise<{ accessToken: string}> {
    const payload = {
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
    };
    return new Promise((resolve, reject) => {
      jwt.sign(payload, config.get<string>('jwtSecret'), {
        // expiresIn: '600000'
        expiresIn: '1800000'
      }, (err, token) => {
        if (err) {
          return reject(err);
        }
        return resolve({ accessToken: token as string });
      });
    });
  }
}
