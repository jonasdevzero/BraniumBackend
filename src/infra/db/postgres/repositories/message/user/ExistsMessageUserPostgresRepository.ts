import { ExistsMessageUserRepository } from '@data/protocols';
import { ExistsMessageUserDTO } from '@domain/dtos/message/user';
import { sql } from '@infra/db/postgres/connection';

export class ExistsMessageUserPostgresRepository
	implements ExistsMessageUserRepository
{
	async exists(data: ExistsMessageUserDTO): Promise<boolean> {
		const { messageId, userId } = data;

		const result = await sql`
			SELECT EXISTS(
				SELECT "userId"
				FROM public."messageUser" AS message_user
				WHERE message_user."userId" = ${userId}
					AND message_user."messageId" = ${messageId}
			)::boolean
	`;

		return !!result[0]?.exists;
	}
}
