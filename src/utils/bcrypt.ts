import * as bcrypt from 'bcrypt';

const SALT = 10;

export async function encodePassword(password: string): Promise<string> {
  const SALT = bcrypt.genSaltSync();
  return bcrypt.hash(password, SALT);
}
