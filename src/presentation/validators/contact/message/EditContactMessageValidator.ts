import { validator } from '@presentation/decorators';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class EditContactMessageValidator implements Middleware {
	private readonly schema = z.object({
		params: z
			.object({
				profileId: z.string().uuid(),
				messageId: z.string().uuid(),
			})
			.strict(),

		body: z
			.object({
				message: z.string(),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
