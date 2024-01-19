import { ExistsContactRepository } from '@data/protocols';
import { ExistsContactDTO } from '@domain/dtos/contact';
import { sql } from '../../connection';

export class ExistsContactPostgresRepository
	implements ExistsContactRepository
{
	async exists(data: ExistsContactDTO): Promise<boolean> {
		const { userId, contactId } = data;

		const result = await sql`
			SELECT EXISTS(
				SELECT "contactId"
				FROM public.contact AS contact
				WHERE contact."userId" = ${userId}
					AND contact."contactId" = ${contactId}
			)::boolean
		`;

		return !!result[0]?.exists;
	}
}
