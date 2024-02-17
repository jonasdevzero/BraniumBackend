import { MessageFileType, MessageType } from '@domain/models';

export interface RawLoadedMessage {
	id: string;
	key: string;
	message?: string;
	type: MessageType;
	createdAt: Date;
	updatedAt?: Date | null;

	sender_id: string;
	sender_name: string;
	sender_username: string;
	sender_image?: string | null;

	file_id?: string;
	file_messageId?: string;
	file_key?: string;
	file_type?: MessageFileType;
	file_user_fileId?: string;
	file_user_key?: string;

	reply_id?: string;
	reply_key?: string;
	reply_message?: string;
	reply_type: MessageType;
	reply_deleted: boolean;
	reply_sender_id: string;
	reply_sender_name: string;
	reply_sender_username: string;
}
