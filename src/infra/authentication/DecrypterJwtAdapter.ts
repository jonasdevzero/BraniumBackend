import { UnauthorizedError } from '@presentation/errors';
import { Decrypter } from '@data/protocols/authentication';
import jwt from 'jsonwebtoken';

export class DecrypterJwtAdapter implements Decrypter {
	decrypt(token: string): string {
		const payload = jwt.decode(token);

		if (payload === null || typeof payload === 'string') {
			throw new UnauthorizedError('Invalid token');
		}

		return payload.sub as string;
	}
}
