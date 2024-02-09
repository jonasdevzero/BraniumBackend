import { LoadedMessage } from '@domain/models';
import { Paginated } from '@domain/types';

export interface ListContactMessagesDTO {
	userId: string;
	contactId: string;

	page: number;
	limit: number;
}

export type ListContactMessagesResultDTO = Paginated<LoadedMessage>;
