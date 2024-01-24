import { ListProfilesRepository } from '@data/protocols';
import { ListProfilesDTO, ListProfilesResultDTO } from '@domain/dtos/profile';
import { sql } from '../../connection';
import { Profile } from '@domain/models';

export class ListProfilesPostgresRepository implements ListProfilesRepository {
	async list(data: ListProfilesDTO): Promise<ListProfilesResultDTO> {
		const { profileId, page, limit, search } = data;

		const offset = page * limit;

		const [rows, countRows] = await Promise.all([
			sql<Profile[]>`
				SELECT
					profile.id,
					profile.name,
					profile.username,
					profile.image,
					profile."createdAt",
					profile."updatedAt"
				FROM public.profile AS profile
				LEFT JOIN public.contact AS contact
					ON contact."userId" = profile.id
					AND contact."contactId" = ${profileId}
				LEFT JOIN public.invite AS invite
					ON invite."senderId" = ${profileId}
					AND invite."receiverId" = profile.id
				LEFT JOIN public.invite AS left_invite
					ON left_invite."senderId" = profile.id
					AND left_invite."receiverId" = ${profileId}
				WHERE profile.id != ${profileId}
					AND contact."createdAt" IS NULL
					AND invite.id IS NULL
					AND left_invite.id IS NULL
					${
						typeof search === 'string'
							? sql`AND profile.username ILIKE ${search}`
							: sql``
					}
				LIMIT ${limit}
				OFFSET ${offset}
			`,
			sql<{ count: number }[]>`
				SELECT COUNT(DISTINCT profile.id)
				FROM public.profile AS profile
				LEFT JOIN public.contact AS contact
					ON contact."userId" = profile.id
					AND contact."contactId" = ${profileId}
				LEFT JOIN public.invite AS invite
					ON invite."senderId" = ${profileId}
					AND invite."receiverId" = profile.id
				LEFT JOIN public.invite AS left_invite
					ON left_invite."senderId" = profile.id
					AND left_invite."receiverId" = ${profileId}
				WHERE profile.id != ${profileId}
					AND contact."createdAt" IS NULL
					AND invite.id IS NULL
					AND left_invite.id IS NULL
					${
						typeof search === 'string'
							? sql`AND profile.username ILIKE ${search}`
							: sql``
					}
			`,
		]);

		const count = Number(countRows[0]?.count) || 0;
		const pages = Math.ceil(count / limit);

		return { pages, content: rows };
	}
}
