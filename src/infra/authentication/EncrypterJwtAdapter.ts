import { Encrypter, EncrypterOptions } from '@data/protocols/authentication';
import { ENV } from '@main/config/env';
import jwt from 'jsonwebtoken';

export class EncrypterJwtAdapter implements Encrypter {
	encrypt(value?: string, options: EncrypterOptions = {}): string {
		return jwt.sign({}, ENV.JWT_SECRET, {
			subject: value,
			expiresIn: options.expiresIn || ENV.JWT_EXPIRES_IN,
		});
	}
}
