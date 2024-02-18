import { LoadContactRepository } from '@data/protocols';
import { FindContactDTO } from '@domain/dtos/contact';
import { LoadedContact } from '@domain/models';
import { sql } from '../../connection';

export class LoadContactPostgresRepository implements LoadContactRepository {
	async load(data: FindContactDTO): Promise<LoadedContact | null> {
		const { userId, contactId } = data;

		const result = await sql<LoadedContact[]>`
			SELECT
				contact_profile.id,
				contact_profile.name,
				contact_profile.username,
				contact.name AS "customName",
				contact_profile.image,
				contact.blocked AS "youBlocked",
				left_contact.blocked AS blocked,
				contact."createdAt",
				COALESCE(last_message."createdAt", contact."createdAt") AS "lastUpdate"
			FROM public.contact AS contact
			LEFT JOIN public.contact AS left_contact
				ON left_contact."userId" = contact."contactId"
				AND left_contact."contactId" = contact."userId"
			LEFT JOIN public.profile AS contact_profile
				ON contact_profile.id = contact."contactId"
			LEFT JOIN public.message AS last_message
				ON last_message.id = (
					SELECT inner_message.id
					FROM public.message AS inner_message
					LEFT JOIN public."messageUser" AS message_user
						ON message_user."messageId" = inner_message.id
						AND message_user."userId" = ${userId}
						AND message_user."contactId" = contact_profile.id
					WHERE inner_message.deleted IS FALSE
						AND inner_message."groupId" IS NULL
						AND message_user."userId" IS NOT NULL
					ORDER BY inner_message."createdAt" DESC
					LIMIT 1
				)
			WHERE contact."userId" = ${userId}
				AND contact."contactId" = ${contactId}
		`;

		return result[0] || null;
	}
}
