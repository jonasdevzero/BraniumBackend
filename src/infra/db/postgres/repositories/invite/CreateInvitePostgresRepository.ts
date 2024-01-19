import { CreateInviteRepository } from '@data/protocols';
import { CreateInviteDTO } from '@domain/dtos/invite';
import { sql } from '../../connection';
import { randomUUID } from 'crypto';

export class CreateInvitePostgresRepository implements CreateInviteRepository {
	async create(data: CreateInviteDTO): Promise<void> {
		await sql`INSERT INTO public.invite ${sql({
			id: randomUUID(),
			...data,
		})}`;
	}
}
