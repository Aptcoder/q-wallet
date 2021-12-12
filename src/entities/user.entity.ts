import {
  Column, Entity, OneToOne, PrimaryGeneratedColumn
} from 'typeorm';
import Account from './account.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column({
    type: 'varchar',
    nullable: false
  })
    firstName!: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
    lastName!: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
    password!: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
    email!: string;

  @Column()
    phoneNumber!: string;

  @OneToOne(() => Account, (account) => account.user, {
    cascade: true
  })
    account!: Account;
}
