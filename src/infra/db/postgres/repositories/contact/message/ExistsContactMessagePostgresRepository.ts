import { ExistsContactMessageRepository } from '@data/protocols';
import { ExistsContactMessageDTO } from '@domain/dtos/contact';
import { sql } from '@infra/db/postgres/connection';

export class ExistsContactMessagePostgresRepository
	implements ExistsContactMessageRepository
{
	async exists(data: ExistsContactMessageDTO): Promise<boolean> {
		const { messageId, userId, contactId } = data;

		const result = await sql`
			SELECT EXISTS(
				SELECT message.id
				FROM public.message AS message
				LEFT JOIN public."messageUser" AS "user"
					ON "user"."userId" = ${userId}
					AND "user"."messageId" = message.id
				LEFT JOIN public."messageUser" AS contact
					ON contact."userId" = ${contactId}
					AND contact."messageId" = message.id
				WHERE message.id = ${messageId}
					AND message."groupId" IS NULL
					AND "user"."userId" IS NOT NULL
					AND contact."userId" IS NOT NULL
					AND message.deleted IS FALSE
			)::BOOLEAN
		`;

		return !!result[0]?.exists;
	}
}
