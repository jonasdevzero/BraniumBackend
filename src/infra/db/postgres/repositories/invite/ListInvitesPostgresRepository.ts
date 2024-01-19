import { ListInvitesRepository } from '@data/protocols';
import { ListInvitesDTO, ListInvitesResultDTO } from '@domain/dtos/invite';
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

interface CountRow {
	count: number;
}

export class ListInvitesPostgresRepository implements ListInvitesRepository {
	async list(data: ListInvitesDTO): Promise<ListInvitesResultDTO> {
		const { profileId, page, limit } = data;

		const offset = page * limit;

		const [rows, countRows] = await Promise.all([
			sql<Row[]>`
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
			`,
			sql<CountRow[]>`
				SELECT COUNT(DISTINCT id) AS count
				FROM public.invite
				WHERE "receiverId" = ${profileId}
			`,
		]);

		const content = rows.map<LoadedInvite>((row) => {
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

		const count = Number(countRows[0]?.count) || 0;
		const pages = Math.ceil(count / limit);

		return { pages, content };
	}
}
