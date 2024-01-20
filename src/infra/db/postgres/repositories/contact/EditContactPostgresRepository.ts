import { EditContactRepository } from '@data/protocols';
import { EditContactDTO } from '@domain/dtos/contact';
import { sql } from '../../connection';

export class EditContactPostgresRepository implements EditContactRepository {
	async edit(data: EditContactDTO): Promise<void> {
		const { profileId, contactId, ...rest } = data;

		const hasData = Object.values(rest).some((v) => typeof v !== 'undefined');
		if (!hasData) return;

		await sql`
			UPDATE public.contact
			SET ${sql(rest)}
			WHERE "userId" = ${profileId} AND "contactId" = ${contactId}
		`;
	}
}
