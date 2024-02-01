import { ListContactMessagesDTO } from '@domain/dtos/contact';
import { LoadedMessage } from '@domain/models';

export interface ListContactMessagesRepository {
	list(data: ListContactMessagesDTO): Promise<LoadedMessage[]>;
}
