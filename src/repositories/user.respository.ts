import { EntityRepository, Repository } from 'typeorm';
import { IAccountRepository, IUserRepository } from '../utils/interfaces/repos.interfaces';
import User from '../entities/user.entity';

@EntityRepository(User)
export default class UserRepository extends Repository<User> implements IUserRepository {
    findByEmail(email: string){
        const user = this.createQueryBuilder("user").where({
            email: email
        }).getOne()
        return user
    }
}
