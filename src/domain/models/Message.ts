export interface Message {
	id: string;
	senderId: string;
	replyId?: string;
	groupId?: string;

	message?: string;
	type: MessageType;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'MIX';

export interface MessageUser {
	messageId: string;
	userId: string;

	key: string;
}

export interface MessageFile {
	id: string;
	fileId: string;

	key: string;
	type: MessageFileType;
}

export type MessageFileType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';

export interface MessageFileUser {
	fileId: string;
	userId: string;

	key: string;
}
