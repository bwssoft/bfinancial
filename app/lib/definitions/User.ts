import { userRepo } from "../mongodb/repositories/user.mongo";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export type IUser = {
  username: string;
  password: string;
  created_at: Date;
  uuid: string;
  email: string;
}

type IinializeUser = Partial<Omit<IUser, 'uuid' | 'created_at' | 'password'>>; 

export class UserEntity implements Partial<IUser> {
  public created_at?: Date;
  public password?: string;
  public username?: string;
  email?: string;
  public readonly uuid?: string;

  constructor(data?: IinializeUser) {
    Object.assign(this, {
      ...data,
      uuid: uuid()
    } as IUser);
  }

  private workingObjetc() {
    this.created_at = new Date();
  }

  public async save() {
    this.workingObjetc();
    await userRepo.create(this);
  }

  public setPassword(password: string) {
    const hashPassword = bcrypt.hashSync(password, 10);
    this.password = hashPassword;
    return hashPassword;
  }
}