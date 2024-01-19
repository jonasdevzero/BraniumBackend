import { FindInviteByIdRepository } from '@data/protocols';
import { Invite } from '@domain/models';
import { sql } from '../../connection';

export class FindInviteByIdPostgresRepository
	implements FindInviteByIdRepository
{
	async find(id: string): Promise<Invite | null> {
		const result = await sql<
			Invite[]
		>`SELECT * FROM public.invite WHERE id = ${id}`;

		return result[0] || null;
	}
}
