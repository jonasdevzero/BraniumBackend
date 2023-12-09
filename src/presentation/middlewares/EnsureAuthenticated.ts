import { UnauthorizedError } from '@presentation/errors';
import { Decrypter } from '@data/protocols/authentication';
import { inject, injectable } from '@container';
import { HttpRequest, Middleware } from '../protocols';

@injectable()
export class EnsureAuthenticated implements Middleware {
	constructor(
		@inject('Decrypter')
		private readonly decrypter: Decrypter
	) {}

	async handle(httpRequest: HttpRequest): Promise<void> {
		const { authorization } = httpRequest.headers;

		if (!authorization) {
			throw new UnauthorizedError('Invalid token');
		}

		const { 1: token } = authorization.split(' ');

		const id = this.decrypter.decrypt(token);

		Object.assign(httpRequest.user, { id });
	}
}
