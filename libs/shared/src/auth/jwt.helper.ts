import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { omit } from 'lodash';

// ref: https://harshitpant.com/blog/password-hashing-in-node-js-using-the-pbkdf2-in-crypto-library

const ITERATIONS = process.env.JWT_ITERATIONS
  ? parseInt(process.env.JWT_ITERATIONS, 10)
  : 1000;
const PASSLEN = process.env.JWT_PASSLEN
  ? parseInt(process.env.JWT_PASSLEN, 10)
  : 256;
const SALTLEN = process.env.JWT_SALTLEN
  ? parseInt(process.env.JWT_SALTLEN, 10)
  : 16;
const DIGEST = process.env.JWT_DIGEST || 'sha1';
const ENCODING: BufferEncoding = (process.env.JWT_ENCODING as any) || 'base64';

export class JwtHelper {
  /**
   * Create JWT token.
   *
   * @param identity user identity
   * @param expiresIn '365 days', '1d', '4 hours', '5 minutes', etc
   */
  static createToken<T extends object>(
    identity: T,
    expiresIn: string = '1d'
  ): string {
    const token = jwt.sign(
      {
        ...omit(identity, ['exp', 'iat', 'aud', 'iss'] as any),
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER,
      } as jwt.SignOptions
    );
    return token;
  }

  static verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET as string);
  }

  /**
   * Generate hash & salt from plain text password.
   *
   * @param password plain text password
   */
  static createPassword(password: string) {
    const salt = crypto.randomBytes(SALTLEN).toString(ENCODING);

    const hash = crypto
      .pbkdf2Sync(
        password,
        ENCODING === 'hex' ? salt : Buffer.from(salt, ENCODING),
        ITERATIONS,
        PASSLEN,
        DIGEST
      )
      .toString(ENCODING);

    return {
      hash,
      salt,
    };
  }

  /**
   * Verify that supplied password is correct.
   *
   * @param passwordHash password hash
   * @param passwordSalt password salt
   * @param password supplied password
   */
  static verifyPassword(
    passwordHash: string,
    passwordSalt: string,
    password: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const storedHashBytes = Buffer.from(passwordHash, ENCODING);
      const storedSaltBytes =
        ENCODING === 'hex' ? passwordSalt : Buffer.from(passwordSalt, ENCODING);

      crypto.pbkdf2(
        password,
        storedSaltBytes,
        ITERATIONS,
        PASSLEN,
        DIGEST,
        (err, calculatedHashBytes) => {
          if (err) {
            reject(err);
          } else {
            const correct =
              ENCODING === 'hex'
                ? passwordHash === calculatedHashBytes.toString(ENCODING)
                : calculatedHashBytes.equals(storedHashBytes);
            if (correct) {
              return resolve(true);
            } else {
              resolve(false);
            }
          }
        }
      );
    });
  }
}
