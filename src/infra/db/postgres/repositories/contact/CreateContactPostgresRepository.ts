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
				contact.name AS "customName",
				contact_profile.image,
				contact.blocked AS "youBlocked",
				left_contact.blocked AS blocked,
				contact."createdAt"
			FROM inserted AS contact
			LEFT JOIN public.contact AS left_contact
				ON left_contact."userId" = contact."contactId"
				AND left_contact."contactId" = contact."userId"
			LEFT JOIN public.profile AS contact_profile
				ON contact_profile.id = contact."contactId"
		`;

		return result;
	}
}
