import { CreateContactRepository } from '@data/protocols';
import { CreateContactDTO } from '@domain/dtos/contact';
import { sql } from '../../connection';
import { LoadedContact } from '@domain/models';

export class CreateContactPostgresRepository
	implements CreateContactRepository
{
	async create(data: CreateContactDTO): Promise<LoadedContact[]> {
		const result = await sql<LoadedContact[]>`
			WITH inserted AS (
				INSERT INTO public.contact ${sql(data)}
				RETURNING *
			)
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
			FROM inserted AS contact
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
						AND message_user."userId" = contact."userId"
						AND message_user."contactId" = contact."contactId"
					WHERE inner_message.deleted IS FALSE
						AND inner_message."groupId" IS NULL
						AND message_user."userId" IS NOT NULL
					ORDER BY inner_message."createdAt" DESC
					LIMIT 1
				)
		`;

		return result;
	}
}
