import { validator } from '@presentation/decorators';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class CreateInviteValidator implements Middleware {
	private readonly schema = z.object({
		body: z
			.object({
				senderId: z.string().uuid(),
				receiverId: z.string().uuid(),

				message: z.string().optional(),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
