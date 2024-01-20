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
				contact.name AS "customName",
				contact_profile.image,
				contact.blocked AS "youBlocked",
				left_contact.blocked AS blocked,
				contact."createdAt"
			FROM public.contact AS contact
			LEFT JOIN public.contact AS left_contact
				ON left_contact."userId" = contact."contactId"
				AND left_contact."contactId" = contact."userId"
			LEFT JOIN public.profile AS contact_profile
				ON contact_profile.id = contact."contactId"
			WHERE contact."userId" = ${userId}
				AND contact."contactId" = ${contactId}
		`;

		return result[0] || null;
	}
}
