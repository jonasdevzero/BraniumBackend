import { CreateContactMessageDTO } from '@domain/dtos/contact';

export interface CreateContactMessage {
	create(data: CreateContactMessageDTO): Promise<void>;
}
