import { DeleteMessageUserRepository } from '@data/protocols';
import { DeleteMessageUserDTO } from '@domain/dtos/message/user';
import { sql } from '@infra/db/postgres/connection';

export class DeleteMessageUserPostgresRepository
	implements DeleteMessageUserRepository
{
	async delete(data: DeleteMessageUserDTO): Promise<void> {
		const { messageId, userId } = data;

		await sql`DELETE FROM public."messageUser" WHERE "messageId" = ${messageId} AND "userId" = ${userId}`;
	}
}
