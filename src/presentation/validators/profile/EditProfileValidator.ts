import { validator } from '@presentation/decorators';
import { fileSchema } from '@presentation/helpers/validation';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class EditProfileValidator implements Middleware {
	private readonly schema = z.object({
		params: z.object({ profileId: z.string().uuid() }).strict().required(),

		files: z
			.object({
				image: z.array(fileSchema).max(1).default([]),
			})
			.strict(),

		body: z
			.object({
				name: z.string().optional(),
				image: z.null().optional(),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
