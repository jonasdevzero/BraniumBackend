import { CountInvitesRepository } from '@data/protocols';
import { sql } from '../../connection';

interface CountRow {
	count: number;
}

export class CountInvitesPostgresRepository implements CountInvitesRepository {
	async count(profileId: string): Promise<number> {
		const countRows = await sql<CountRow[]>`
			SELECT COUNT(DISTINCT invite.id) AS count
			FROM public.invite AS invite
			WHERE invite."receiverId" = ${profileId}
		`;

		const count = Number(countRows[0]?.count) || 0;

		return count;
	}
}
