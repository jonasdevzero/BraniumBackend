import { CreateContactDTO } from '@domain/dtos/contact';
import { LoadedContact } from '@domain/models';

export interface CreateContactRepository {
	create(data: CreateContactDTO): Promise<LoadedContact[]>;
}
