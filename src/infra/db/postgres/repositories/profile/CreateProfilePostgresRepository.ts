import { CreateProfileRepository } from '@data/protocols';
import { CreateProfileDTO } from '@domain/dtos/profile';
import { sql } from '../../connection';

export class CreateProfilePostgresRepository
	implements CreateProfileRepository
{
	async create(data: CreateProfileDTO): Promise<void> {
		await sql`INSERT INTO public.profile ${sql(data)}`;
	}
}
