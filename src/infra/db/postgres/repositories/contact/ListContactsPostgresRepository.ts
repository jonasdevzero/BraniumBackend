import { ListContactsRepository } from '@data/protocols';
import { ListContactsDTO, ListContactsResultDTO } from '@domain/dtos/contact';
import { sql } from '../../connection';
import { LoadedContact } from '@domain/models';

interface CountRow {
	count: number;
}

export class ListContactsPostgresRepository implements ListContactsRepository {
	async list(data: ListContactsDTO): Promise<ListContactsResultDTO> {
		const { profileId, page, limit, search } = data;

		const offset = page * limit;

		const [rows, countRows] = await Promise.all([
			sql<LoadedContact[]>`
				SELECT
					contact_profile.id,
					contact_profile.name,
					contact_profile.username,
					contact.name AS "customName",
					contact_profile.image,
					contact.blocked AS "youBlocked",
					left_contact.blocked AS blocked,
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
							AND message_user."userId" = ${profileId}
							AND message_user."contactId" = contact_profile.id
						WHERE inner_message.deleted IS FALSE
							AND inner_message."groupId" IS NULL
							AND message_user."userId" IS NOT NULL
						ORDER BY inner_message."createdAt" DESC
						LIMIT 1
					)
				WHERE contact."userId" = ${profileId}
					${
						typeof search === 'string'
							? sql`AND (contact_profile.name ILIKE ${`%${search}%`} OR contact_profile.username ILIKE ${`%${search}%`})`
							: sql``
					}
				ORDER BY COALESCE(last_message."createdAt", contact."createdAt") DESC
				LIMIT ${limit}
				OFFSET ${offset}
			`,
			sql<CountRow[]>`
				SELECT COUNT(DISTINCT contact."contactId") AS count
				FROM public.contact AS contact
				LEFT JOIN public.contact AS left_contact
					ON left_contact."userId" = contact."contactId"
					AND left_contact."contactId" = contact."userId"
				LEFT JOIN public.profile AS contact_profile
					ON contact_profile.id = contact."contactId"
				WHERE contact."userId" = ${profileId}
				${
					typeof search === 'string'
						? sql`AND (contact_profile.name ILIKE ${`%${search}%`} OR contact_profile.username ILIKE ${`%${search}%`})`
						: sql``
				}
			`,
		]);

		const count = Number(countRows[0]?.count) || 0;
		const pages = Math.ceil(count / limit);

		return { pages, content: rows };
	}
}
