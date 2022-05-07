/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import bcrypt from 'bcrypt';
import _ from 'lodash';
import Account from '../entities/account.entity';
import { IUserRepository } from '../utils/interfaces/repos.interfaces';
import { CreateUserDto } from '../utils/dtos/users.dto';
import { ConflictError } from '../utils/errors';

interface UserDataInterface {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phoneNumber: string
}

export default class UserService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  private async _hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto
    const existingUser = await this.userRepository.findByEmail(email)

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await this._hashPassword(password);
    let user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    const account = new Account();
    user.account = account;
    user = await this.userRepository.save(user);
    return user;
  }

  // public async authUser(userEmail: string, userPassword: string) {
  //   const user = await this.userRepo.findOne({
  //     where: {
  //       email: userEmail
  //     },
  //     select: ['firstName', 'lastName', 'id', 'email', 'account', 'password', 'phoneNumber'],
  //     relations: ['account']
  //   });

  //   if (!user) {
  //     throw new ServiceError({ message: 'User not found', status: 404 });
  //   }

  //   const comparePasswordResult = UserService._comparePassword(userPassword, user.password);
  //   if (!comparePasswordResult) {
  //     throw new ServiceError({ message: 'Incorrect password', status: 401 });
  //   }

  //   const { accessToken } = await UserService._generateToken(user);

  //   const userWithoutPasssword = _.omit(user, 'password');
  //   return { accessToken, user: userWithoutPasssword };
  // }

  // public async getUser(userId: string) {
  //   const user = await this.userRepo.findOne(userId, {
  //     select: ['firstName', 'lastName', 'id', 'email', 'account', 'phoneNumber'],
  //     relations: ['account']
  //   });
  //   return user;
  // }



  // private static async _comparePassword(enteredPassword: string, password: string) {
  //   return bcrypt.compare(enteredPassword, password);
  // }

  // private static async _generateToken(user: User):Promise<{ accessToken: string}> {
  //   console.log('user', user);
  //   const payload = {
  //     email: user.email,
  //     id: user.id,
  //     accountId: user.account.id,
  //     firstName: user.firstName,
  //     lastName: user.lastName
  //   };
  //   return new Promise((resolve, reject) => {
  //     jwt.sign(payload, config.get<string>('jwtSecret'), {
  //       // expiresIn: '600000'
  //       expiresIn: '18000000'
  //     }, (err, token) => {
  //       if (err) {
  //         return reject(err);
  //       }
  //       return resolve({ accessToken: token as string });
  //     });
  //   });
  // }
}
