import { EditMessageRepository } from '@data/protocols';
import { EditMessageDTO } from '@domain/dtos/message';
import { sql } from '../../connection';
import { removeUndefinedProps } from '../../helpers';

export class EditMessagePostgresRepository implements EditMessageRepository {
	async edit(data: EditMessageDTO): Promise<void> {
		const { id, ...rest } = data;

		removeUndefinedProps(rest);

		const hasData = Object.keys(rest).length > 0;
		if (!hasData) return;

		Object.assign(rest, { updatedAt: new Date() });

		await sql`UPDATE public.message SET ${sql(rest)} WHERE id = ${id};`;
	}
}
