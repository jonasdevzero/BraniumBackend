export interface DeleteMessageRepository {
	delete(id: string): Promise<void>;
}
