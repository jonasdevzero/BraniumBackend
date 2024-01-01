import { injectable } from '@container';
import { HttpRequest, Middleware } from '../protocols';

@injectable()
export class EnsureAuthenticated implements Middleware {
	async handle(httpRequest: HttpRequest): Promise<void> {
		// ...
	}
}
