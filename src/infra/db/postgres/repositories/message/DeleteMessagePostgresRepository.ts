import { DeleteMessageRepository } from '@data/protocols';
import { sql } from '../../connection';

export class DeleteMessagePostgresRepository
	implements DeleteMessageRepository
{
	async delete(id: string): Promise<void> {
		await sql.begin(async (sql) => {
			await Promise.all([
				sql`
					UPDATE public.message
					SET
						message = null,
						deleted = TRUE,
						"createdAt" = ${new Date(0)},
						"updatedAt" = null
					WHERE id = ${id}`,
				sql`DELETE FROM public."messageUser" WHERE "messageId" = ${id}`,
				sql`DELETE FROM public."messageFile" WHERE "messageId" = ${id}`,
			]);
		});
	}
}
