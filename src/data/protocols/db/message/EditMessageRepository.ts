import { EditMessageDTO } from '@domain/dtos/message';

export interface EditMessageRepository {
	edit(data: EditMessageDTO): Promise<void>;
}
