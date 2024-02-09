import {
	ListContactMessagesDTO,
	ListContactMessagesResultDTO,
} from '@domain/dtos/message/contact';

export interface ListContactMessages {
	list(data: ListContactMessagesDTO): Promise<ListContactMessagesResultDTO>;
}
