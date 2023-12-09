import { ENV } from '@main/config/env';
import { HttpRequest, Middleware } from '../protocols';
import { UnauthorizedError } from '@presentation/errors';

export class EnsureBasicAuth implements Middleware {
	private readonly basic = {
		user: ENV.BASIC_USER,
		pass: ENV.BASIC_PASS,
	};

	async handle(httpRequest: HttpRequest): Promise<void> {
		const { authorization } = httpRequest.headers;

		if (!authorization) {
			throw new UnauthorizedError('Invalid token');
		}

		const [protocol, value] = authorization.split(' ');

		if (protocol.toLowerCase() !== 'basic') {
			throw new UnauthorizedError('Invalid token');
		}

		const [user, pass] = Buffer.from(value, 'base64')
			.toString('utf-8')
			.split(':');

		if (user !== this.basic.user || pass !== this.basic.pass) {
			throw new UnauthorizedError('Invalid token');
		}
	}
}
