export interface ListAllMessageUsersRepository {
	list(messageId: string): Promise<string[]>;
}
