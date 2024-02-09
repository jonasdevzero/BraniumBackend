import { CreateContactMessageDTO } from '@domain/dtos/message/contact';

export interface CreateContactMessage {
	create(data: CreateContactMessageDTO): Promise<void>;
}
