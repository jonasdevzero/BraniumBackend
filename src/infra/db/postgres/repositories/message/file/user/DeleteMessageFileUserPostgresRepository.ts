import { DeleteMessageFileUserRepository } from '@data/protocols';
import { DeleteMessageFileUserDTO } from '@domain/dtos/message/file';
import { sql } from '@infra/db/postgres/connection';

export class DeleteMessageFileUserPostgresRepository
	implements DeleteMessageFileUserRepository
{
	async delete(data: DeleteMessageFileUserDTO): Promise<void> {
		const { fileId, userId } = data;

		await sql`DELETE FROM public."messageFileUser" WHERE "fileId" = ${fileId} AND "userId" = ${userId}`;
	}
}
