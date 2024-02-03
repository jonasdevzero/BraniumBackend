import { Message } from '@domain/models';

export interface FindMessageByIdRepository {
	find(id: string): Promise<Message | null>;
}
