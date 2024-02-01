import { validator } from '@presentation/decorators';
import { numericString } from '@presentation/helpers/validation';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class ListContactMessagesValidator implements Middleware {
	private readonly schema = z.object({
		query: z
			.object({
				page: numericString(z.number().int().min(0).default(0)),
				limit: numericString(z.number().int().min(1).max(200).default(50)),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
