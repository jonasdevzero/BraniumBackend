import { validator } from '@presentation/decorators';
import { messageFileType, messageType } from '@presentation/helpers';
import { fileSchema } from '@presentation/helpers/validation';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class CreateContactMessageValidator implements Middleware {
	private readonly schema = z.object({
		body: z
			.object({
				sender: z.object({
					id: z.string().uuid(),
					key: z.string(),
				}),
				receiver: z.object({
					id: z.string().uuid(),
					key: z.string(),
				}),

				replyId: z.string().uuid().optional(),

				message: z.string().optional(),
				type: z.enum(messageType),

				files: z
					.array(
						z.object({
							file: fileSchema,
							type: z.enum(messageFileType),

							users: z
								.array(
									z.object({
										id: z.string().uuid(),
										key: z.string(),
									})
								)
								.min(2)
								.max(2),
						})
					)
					.default([]),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
