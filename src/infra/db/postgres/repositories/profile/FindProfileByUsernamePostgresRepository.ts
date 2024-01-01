import { FindProfileByUsernameRepository } from '@data/protocols';
import { Profile } from '@domain/models';
import { sql } from '../../connection';

export class FindProfileByUsernamePostgresRepository
	implements FindProfileByUsernameRepository
{
	async find(username: string): Promise<Profile | null> {
		const result = await sql<Profile[]>`
			SELECT *
			FROM public.profile
			WHERE profile.username = ${username}
		`;

		if (!result.length) return null;
		return result[0];
	}
}
