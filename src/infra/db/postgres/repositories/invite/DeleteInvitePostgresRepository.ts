import { DeleteInviteRepository } from '@data/protocols';
import { sql } from '../../connection';

export class DeleteInvitePostgresRepository implements DeleteInviteRepository {
	async delete(id: string): Promise<void> {
		await sql`DELETE FROM public.invite WHERE id = ${id}`;
	}
}
