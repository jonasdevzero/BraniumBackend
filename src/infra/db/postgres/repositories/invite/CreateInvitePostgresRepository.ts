import { CreateInviteRepository } from '@data/protocols';
import { CreateInviteDTO } from '@domain/dtos/invite';
import { sql } from '../../connection';
import { randomUUID } from 'crypto';
import { LoadedInvite } from '@domain/models';

interface Row {
	id: string;
	message?: string | null;

	sender_name: string;
	sender_username: string;
	sender_image?: string | null;

	createdAt: Date;
}

export class CreateInvitePostgresRepository implements CreateInviteRepository {
	async create(data: CreateInviteDTO): Promise<LoadedInvite> {
		const values = { ...data, id: randomUUID() };

		const [row] = await sql<Row[]>`
			WITH inserted AS (
				INSERT INTO public.invite ${sql(values)}
				RETURNING *
			)
			SELECT
				inserted.id,
				inserted.message,
				sender.name AS sender_name,
				sender.username AS sender_username,
				sender.image AS sender_image,
				inserted."createdAt"
			FROM inserted
			LEFT JOIN public.profile AS sender
				ON sender.id = inserted."senderId"
		`;

		const { sender_name, sender_username, sender_image, ...rest } = row;

		return {
			...rest,
			sender: {
				name: sender_name,
				username: sender_username,
				image: sender_image,
			},
		};
	}
}
