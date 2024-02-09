import { MessageFile } from '@domain/models';

export interface ListMessageFilesRepository {
	list(messageId: string): Promise<MessageFile[]>;
}
