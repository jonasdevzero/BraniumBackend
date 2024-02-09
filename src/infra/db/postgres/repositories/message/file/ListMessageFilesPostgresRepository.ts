import { ListMessageFilesRepository } from '@data/protocols';
import { MessageFile } from '@domain/models';
import { sql } from '@infra/db/postgres/connection';

export class ListMessageFilesPostgresRepository
	implements ListMessageFilesRepository
{
	async list(messageId: string): Promise<MessageFile[]> {
		const rows = await sql<MessageFile[]>`
			SELECT * FROM public."messageFile" WHERE "messageId" = ${messageId}
		`;

		return rows;
	}
}
