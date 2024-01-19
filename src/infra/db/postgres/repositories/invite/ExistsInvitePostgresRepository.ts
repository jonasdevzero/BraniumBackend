import { ExistsInviteRepository } from '@data/protocols';
import { ExistsInviteDTO } from '@domain/dtos/invite';
import { sql } from '../../connection';

export class ExistsInvitePostgresRepository implements ExistsInviteRepository {
	async exists(data: ExistsInviteDTO): Promise<boolean> {
		const { senderId, receiverId } = data;

		const result = await sql`
			SELECT EXISTS(
				SELECT id
				FROM public.invite AS invite
				WHERE invite."senderId" = ${senderId}
					AND invite."receiverId" = ${receiverId}
			)::boolean
		`;

		return !!result[0]?.exists;
	}
}
