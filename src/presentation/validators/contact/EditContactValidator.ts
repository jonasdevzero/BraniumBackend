import { validator } from '@presentation/decorators';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class EditContactValidator implements Middleware {
	private readonly schema = z.object({
		body: z
			.object({
				profileId: z.string().uuid(),
				contactId: z.string().uuid(),

				name: z.string().nullable().optional(),
				blocked: z.boolean().optional(),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
