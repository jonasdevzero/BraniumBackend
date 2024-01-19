import { CreateContactRepository } from '@data/protocols';
import { CreateContactDTO } from '@domain/dtos/contact';
import { sql } from '../../connection';

export class CreateContactPostgresRepository
	implements CreateContactRepository
{
	async create(data: CreateContactDTO): Promise<void> {
		await sql`INSERT INTO public.contact ${sql(data)}`;
	}
}
