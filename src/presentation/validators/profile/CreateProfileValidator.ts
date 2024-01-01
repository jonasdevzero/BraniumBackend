import { validator } from '@presentation/decorators';
import { fileSchema } from '@presentation/helpers/validation';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class CreateProfileValidator implements Middleware {
	private readonly schema = z.object({
		files: z
			.object({
				image: z.array(fileSchema).max(1).optional().default([]),
			})
			.strict(),
		body: z
			.object({
				id: z.string().uuid(),
				username: z.string(),
				name: z.string(),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
