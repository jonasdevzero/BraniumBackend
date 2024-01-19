import { ExistsProfileRepository } from '@data/protocols';
import { sql } from '../../connection';

export class ExistsProfilePostgresRepository
	implements ExistsProfileRepository
{
	async exists(id: string): Promise<boolean> {
		const result = await sql`
			SELECT EXISTS(SELECT id FROM public.profile AS profile WHERE profile.id = ${id})::boolean
		`;

		return !!result[0]?.exists;
	}
}
