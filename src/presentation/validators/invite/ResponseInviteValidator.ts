import { validator } from '@presentation/decorators';
import { HttpRequest, Middleware } from '@presentation/protocols';
import { z } from 'zod';

@validator
export class ResponseInviteValidator implements Middleware {
	private readonly schema = z.object({
		body: z
			.object({
				profileId: z.string().uuid(),
				inviteId: z.string().uuid(),

				accept: z.boolean(),
			})
			.strict(),
	});

	async handle(httpRequest: HttpRequest): Promise<void> {
		const parsed = await this.schema.parseAsync(httpRequest);
		Object.assign(httpRequest, parsed);
	}
}
