import { LoadMessageRepository } from '@data/protocols';
import { LoadMessageDTO } from '@domain/dtos/message';
import { LoadedMessage } from '@domain/models';
import { sql } from '../../connection';
import { parseRawLoadedMessages } from '../../helpers';
import { RawLoadedMessage } from '../../types';

export class LoadMessagePostgresRepository implements LoadMessageRepository {
	async load(data: LoadMessageDTO): Promise<LoadedMessage | null> {
		const { messageId, userId } = data;

		const rows = await sql<RawLoadedMessage[]>`
			SELECT
				message.id,
				message_user.key,
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
			FROM public.message AS message
			LEFT JOIN public."messageUser" AS message_user
				ON message_user."userId" = ${userId}
				AND message_user."messageId" = ${messageId}
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
			WHERE message.id = ${messageId}
				AND message.deleted IS FALSE
				AND message_user."userId" IS NOT NULL
		`;

		const messages = parseRawLoadedMessages(rows);

		if (!messages.length) return null;

		return messages[0];
	}
}
