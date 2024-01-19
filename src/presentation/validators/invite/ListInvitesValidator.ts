import { validator } from '@presentation/decorators';
import { numericString } from '@presentation/helpers/validation';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class ListInvitesValidator implements Middleware {
	private readonly schema = z.object({
		query: z.object({
			page: numericString(z.number().int().min(0).default(0)),
			limit: numericString(z.number().int().min(1).max(30).default(10)),
		}),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
