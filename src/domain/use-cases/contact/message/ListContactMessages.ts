import { ListContactMessagesDTO } from '@domain/dtos/contact';
import { LoadedMessage } from '@domain/models';

export interface ListContactMessages {
	list(data: ListContactMessagesDTO): Promise<LoadedMessage[]>;
}
