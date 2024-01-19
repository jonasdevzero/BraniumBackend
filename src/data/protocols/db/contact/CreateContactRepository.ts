import { CreateContactDTO } from '@domain/dtos/contact';

export interface CreateContactRepository {
	create(data: CreateContactDTO): Promise<void>;
}
