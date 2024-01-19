import { ListInvitesRepository } from '@data/protocols';
import { ListInvitesDTO } from '@domain/dtos/invite';
import { LoadedInvite } from '@domain/models';
import { sql } from '../../connection';

interface Row {
	id: string;
	message?: string | null;

	sender_name: string;
	sender_username: string;
	sender_image?: string | null;

	createdAt: Date;
}

export class ListInvitesPostgresRepository implements ListInvitesRepository {
	async list(data: ListInvitesDTO): Promise<LoadedInvite[]> {
		const { profileId, page, limit } = data;

		const offset = page * limit;

		const rows = await sql<Row[]>`
			SELECT
				invite.id,
				invite.message,
				sender.name AS sender_name,
				sender.username AS sender_username,
				sender.image AS sender_image,
				invite."createdAt"
			FROM public.invite AS invite
			LEFT JOIN public.profile AS sender
				ON sender.id = invite."senderId"
			WHERE invite."receiverId" = ${profileId}
			ORDER BY invite."createdAt" DESC
			LIMIT ${limit}
			OFFSET ${offset}
		`;

		if (!rows.length) return [];

		const result = rows.map<LoadedInvite>((row) => {
			const { sender_name, sender_username, sender_image, ...rest } = row;

			return {
				...rest,
				sender: {
					name: sender_name,
					username: sender_username,
					image: sender_image,
				},
			};
		});

		return result;
	}
}
