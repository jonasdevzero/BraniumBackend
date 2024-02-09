export interface DeleteMessage {
	delete(profileId: string, messageId: string): Promise<void>;
}
