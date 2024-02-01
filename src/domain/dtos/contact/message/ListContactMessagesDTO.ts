export interface ListContactMessagesDTO {
	userId: string;
	contactId: string;

	page: number;
	limit: number;
}
