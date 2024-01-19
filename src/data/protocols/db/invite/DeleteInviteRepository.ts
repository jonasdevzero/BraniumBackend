export interface DeleteInviteRepository {
	delete(id: string): Promise<void>;
}
