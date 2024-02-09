import {
	ListContactMessagesDTO,
	ListContactMessagesResultDTO,
} from '@domain/dtos/contact';
import { LoadedMessage } from '@domain/models';

export interface ListContactMessages {
	list(data: ListContactMessagesDTO): Promise<ListContactMessagesResultDTO>;
}
