import { ListContactMessagesRepository } from '@data/protocols';
import {
	ListContactMessagesDTO,
	ListContactMessagesResultDTO,
} from '@domain/dtos/message/contact';
import { sql } from '@infra/db/postgres/connection';
import { parseRawLoadedMessages } from '@infra/db/postgres/helpers';
import { RawLoadedMessage } from '@infra/db/postgres/types';

interface CountRow {
	count: number;
}

export class ListContactMessagesPostgresRepository
	implements ListContactMessagesRepository
{
	async list(
		data: ListContactMessagesDTO
	): Promise<ListContactMessagesResultDTO> {
		const { userId, contactId, page, limit } = data;

		const offset = page * limit;

		const rowsPromise = sql<RawLoadedMessage[]>`
			SELECT
				message.id,
				real_message_user.key,
				message.message,
				message.type,
				message."createdAt",
				message."updatedAt",
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
				reply.deleted AS reply_deleted,
				reply_sender.id AS reply_sender_id,
				reply_sender.name AS reply_sender_name,
				reply_sender.username AS reply_sender_username
			FROM (
				SELECT message_user.*
				FROM public."messageUser" AS message_user
				LEFT JOIN public.message AS inner_message
					ON inner_message."groupId" IS NULL
					AND inner_message.id = message_user."messageId"
					AND inner_message.deleted IS FALSE
				WHERE message_user."userId" = ${userId}
					AND message_user."contactId" = ${contactId}
					AND inner_message.id IS NOT NULL
				ORDER BY inner_message."createdAt" DESC
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
		const countPromise = sql<CountRow[]>`
			SELECT COUNT(DISTINCT message.id) AS count
			FROM public."messageUser" AS message_user
			LEFT JOIN public.message AS message
				ON message."groupId" IS NULL
				AND message.id = message_user."messageId"
				AND message.deleted IS FALSE
			WHERE message_user."userId" = ${userId}
				AND message_user."contactId" = ${contactId}
				AND message.id IS NOT NULL
		`;

		const [rows, countRows] = await Promise.all([rowsPromise, countPromise]);

		const messages = parseRawLoadedMessages(rows);

		const count = Number(countRows[0]?.count) || 0;
		const pages = Math.ceil(count / limit);

		return { pages, content: messages };
	}
}
