import { ListAllMessageUsersRepository } from '@data/protocols';
import { sql } from '@infra/db/postgres/connection';

export class ListAllMessageUsersPostgresRepository
	implements ListAllMessageUsersRepository
{
	async list(messageId: string): Promise<string[]> {
		const result = await sql<{ userId: string }[]>`
			SELECT "userId"
			FROM public."messageUser" AS message_user
			WHERE message_user."messageId" = ${messageId}
		`;

		return result.map(({ userId }) => userId);
	}
}
