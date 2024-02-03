import { FindMessageByIdRepository } from '@data/protocols';
import { Message } from '@domain/models';
import { sql } from '../../connection';

export class FindMessageByIdPostgresRepository
	implements FindMessageByIdRepository
{
	async find(id: string): Promise<Message | null> {
		const rows = await sql<Message[]>`
			SELECT * FROM public.message WHERE id = ${id};
		`;

		if (!rows[0]) return null;

		return rows[0];
	}
}
