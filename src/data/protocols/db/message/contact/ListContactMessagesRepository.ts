import {
	ListContactMessagesDTO,
	ListContactMessagesResultDTO,
} from '@domain/dtos/message/contact';

export interface ListContactMessagesRepository {
	list(data: ListContactMessagesDTO): Promise<ListContactMessagesResultDTO>;
}
