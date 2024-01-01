import { FindProfileByIdRepository } from '@data/protocols';
import { Profile } from '@domain/models';
import { sql } from '../../connection';

export class FindProfileByIdPostgresRepository
	implements FindProfileByIdRepository
{
	async find(id: string): Promise<Profile | null> {
		const result = await sql<Profile[]>`
			SELECT *
			FROM public.profile
			WHERE profile.id = ${id}
		`;

		if (!result.length) return null;
		return result[0];
	}
}
