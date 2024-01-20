import { EditProfileRepository } from '@data/protocols';
import { EditProfileDTO } from '@domain/dtos/profile';
import { sql } from '../../connection';

export class EditProfilePostgresRepository implements EditProfileRepository {
	async edit(data: EditProfileDTO): Promise<void> {
		const { profileId, ...rest } = data;

		const hasData = Object.values(rest).some((v) => typeof v !== 'undefined');
		if (!hasData) return;

		await sql`UPDATE public.profile SET ${sql(rest)} WHERE id = ${profileId}`;
	}
}
