import { Hasher } from '@data/protocols/authentication';
import bcrypt from 'bcryptjs';

export class HasherBcryptAdapter implements Hasher {
	async hash(value: string): Promise<string> {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(value, salt);
	}
}
