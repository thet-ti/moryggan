import bcrypt from 'bcrypt';
import { env } from './env';

export class HashService {
  static genSalt = async (salt : number = env.HASH_SALT) => bcrypt.genSalt(salt)
    .then((res) => res)
    .catch((err) => { throw new Error(err); });

  static genHash = async (plainText : string) => {
    const salt = await this.genSalt();

    return bcrypt.hash(plainText, salt)
      .then((res) => res)
      .catch((err) => { throw new Error(err); });
  };

  static validateHash = async (plainText: string, hash: string) => bcrypt.compare(plainText, hash)
    .then((res) => res)
    .catch((err) => { throw new Error(err); });
}
