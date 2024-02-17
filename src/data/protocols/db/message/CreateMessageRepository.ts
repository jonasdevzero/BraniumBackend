import { CreateMessageDTO } from '@domain/dtos/message';

export interface CreateMessageRepository {
	create(data: CreateMessageDTO): Promise<string>;
}
