import { LoadMessageDTO } from '@domain/dtos/message';
import { LoadedMessage } from '@domain/models';

export interface LoadMessageRepository {
	load(data: LoadMessageDTO): Promise<LoadedMessage | null>;
}
