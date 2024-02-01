import { CreateMessageRepository } from '@data/protocols';
import { CreateMessageDTO } from '@domain/dtos/message';
import { sql } from '../../connection';
import { randomUUID } from 'crypto';
import { MessageFileUser } from '@domain/models';

export class CreateMessagePostgresRepository
	implements CreateMessageRepository
{
	async create(data: CreateMessageDTO): Promise<void> {
		const { users, files, ...rest } = data;

		await sql.begin(async (sql) => {
			const id = randomUUID();

			const messageUsers = users.map((u) => ({
				messageId: id,
				userId: u.id,
				key: u.key,
			}));

			const messageFilesUsers: MessageFileUser[] = [];

			const messageFiles = files.map((f) => {
				const fileId = randomUUID();

				messageFilesUsers.push(
					...f.users.map((u) => ({ fileId, userId: u.id, key: u.key }))
				);

				return {
					id: fileId,
					messageId: id,
					key: f.key,
					type: f.type,
				};
			});

			await sql`INSERT INTO public.message ${sql({ id, ...rest })}`;
			await sql`INSERT INTO public."messageUser" ${sql(messageUsers)}`;

			if (messageFiles.length === 0) return;

			await sql`INSERT INTO public."messageFile" ${sql(messageFiles)}`;

			await sql`INSERT INTO public."messageFileUser" ${sql(messageFilesUsers)}`;
		});
	}
}
