import { MessageFileType, MessageType } from '@domain/models';

export interface CreateMessageDTO {
	senderId: string;
	replyId?: string;
	groupId?: string;

	message?: string;
	type: MessageType;

	users: Array<{
		id: string;
		key: string;
	}>;

	files: Array<{
		key: string;
		type: MessageFileType;

		users: Array<{
			id: string;
			key: string;
		}>;
	}>;
}
