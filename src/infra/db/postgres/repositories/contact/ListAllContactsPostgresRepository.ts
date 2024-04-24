import { ListAllContactsRepository } from '@data/protocols';
import { sql } from '../../connection';

export class ListAllContactsPostgresRepository
	implements ListAllContactsRepository
{
	async list(profileId: string): Promise<string[]> {
		const result = await sql<[{ contactId: string }]>`
			SELECT "contactId"
			FROM public.contact
			WHERE "userId" = ${profileId}
		`;

		return result.map((r) => r.contactId);
	}
}
