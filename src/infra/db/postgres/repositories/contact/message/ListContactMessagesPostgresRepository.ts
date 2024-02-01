import { ListContactMessagesRepository } from '@data/protocols';
import { ListContactMessagesDTO } from '@domain/dtos/contact';
import { LoadedMessage, MessageFileType, MessageType } from '@domain/models';
import { sql } from '@infra/db/postgres/connection';

interface Row {
	id: string;
	key: string;
	message?: string;
	type: MessageType;
	createdAt: Date;

	sender_id: string;
	sender_name: string;
	sender_username: string;
	sender_image?: string | null;

	file_id?: string;
	file_messageId?: string;
	file_key?: string;
	file_type?: MessageFileType;
	file_user_fileId?: string;
	file_user_key?: string;

	reply_id?: string;
	reply_key: string;
	reply_message?: string;
	reply_type: MessageType;
	reply_sender_id: string;
	reply_sender_name: string;
	reply_sender_username: string;
}

export class ListContactMessagesPostgresRepository
	implements ListContactMessagesRepository
{
	async list(data: ListContactMessagesDTO): Promise<LoadedMessage[]> {
		const { userId, contactId, page, limit } = data;

		const offset = page * limit;

		const rows = await sql<Row[]>`
			SELECT
				message.id,
				real_message_user.key,
				message.message,
				message.type,
				message."createdAt",
				sender.id AS sender_id,
				sender.name AS sender_name,
				sender.username AS sender_username,
				sender.image AS sender_image,
				message_file.id AS file_id,
				message_file."messageId" AS "file_messageId",
				message_file.key AS file_key,
				message_file.type AS file_type,
				message_file_user."fileId" AS "file_user_fileId",
				message_file_user.key AS file_user_key,
				reply.id AS reply_id,
				reply_user.key AS reply_key,
				reply.message AS reply_message,
				reply.type AS reply_type,
				reply_sender.id AS reply_sender_id,
				reply_sender.name AS reply_sender_name,
				reply_sender.username AS reply_sender_username
			FROM (
				SELECT message_user.*
				FROM public."messageUser" AS message_user
				LEFT JOIN public.message AS inner_message
					ON inner_message."groupId" IS NULL
					AND inner_message.id = message_user."messageId"
				WHERE 
				(
					message_user."userId"  = ${userId} 
					AND inner_message."senderId" = ${contactId}
				)
				OR (
					message_user."userId" = ${contactId}
					AND inner_message."senderId" = ${userId}
				)
				LIMIT ${limit}
				OFFSET ${offset}
			) AS message_user
			LEFT JOIN public.message AS message
				ON message."groupId" IS NULL
				AND message.id = message_user."messageId"
			LEFT JOIN public."messageUser" AS real_message_user
				ON real_message_user."userId" = ${userId}
				AND real_message_user."messageId" = message.id
			LEFT JOIN public.profile AS sender
				ON sender.id = message."senderId"
			LEFT JOIN public.message AS reply
				ON reply.id = message."replyId"
			LEFT JOIN public."messageUser" AS reply_user
				ON reply_user."messageId" = reply.id
				AND reply_user."userId" = ${userId}
			LEFT JOIN public.profile AS reply_sender
				ON reply_sender.id = reply."senderId"
			LEFT JOIN public."messageFile" AS message_file
				ON message_file."messageId" = message.id
			LEFT JOIN public."messageFileUser" AS message_file_user
				ON message_file_user."fileId" = message_file.id
				AND message_file_user."userId" = ${userId}
			GROUP BY
				message.id,
				real_message_user.key,
				sender.id,
				message_file.id,
				message_file_user."fileId",
				message_file_user.key,
				reply.id,
				reply_user.key,
				reply_sender.id
			ORDER BY message."createdAt" DESC;
		`;

		const messages = this.groupBy(rows, 'id').map((row) => {
			const {
				id,
				key,
				message,
				type,
				createdAt,
				sender_id,
				sender_name,
				sender_username,
				sender_image,

				reply_id,
				reply_key,
				reply_message,
				reply_type,

				reply_sender_id,
				reply_sender_name,
				reply_sender_username,
			} = row[0];

			let reply;

			if (!!reply_id) {
				reply = {
					id: String(reply_id),
					key: reply_key,
					message: reply_message,
					type: reply_type,

					sender: {
						id: reply_sender_id,
						name: reply_sender_name,
						username: reply_sender_username,
					},
				};
			}

			const files = this.groupBy(row, 'file_id')
				.filter((f) => f[0].file_messageId === id)
				.map((file) => {
					const { file_id, file_key, file_type, file_user_key } = file[0];

					return {
						id: String(file_id),
						url: String(file_key),
						type: String(file_type) as MessageFileType,
						key: String(file_user_key),
					};
				});

			return {
				id,
				key,
				message,
				type,
				createdAt,

				sender: {
					id: sender_id,
					name: sender_name,
					username: sender_username,
					image: sender_image,
				},

				reply,
				files,
			};
		});

		return messages;
	}

	private groupBy<D extends Array<any>>(data: D, key: keyof D[number]): D[] {
		return data.reduce((groups, current: D) => {
			const group = groups.find((g: any) => g[0][key] === current[key]);
			group ? group.push(current) : groups.push([current]);

			return groups;
		}, [] as unknown as D[]);
	}
}
