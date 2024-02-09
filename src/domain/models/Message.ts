export interface Message {
	id: string;
	senderId: string;
	replyId?: string;
	groupId?: string;

	message?: string;
	type: MessageType;

	createdAt: Date;
	updatedAt?: Date;
	deleted: boolean;
}

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'MIX';

export interface MessageUser {
	messageId: string;
	userId: string;

	key: string;
}

export interface MessageFile {
	id: string;
	messageId: string;

	key: string;
	type: MessageFileType;
}

export type MessageFileType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';

export interface MessageFileUser {
	fileId: string;
	userId: string;

	key: string;
}

export interface LoadedMessage {
	id: string;
	key: string;
	type: MessageType;
	message?: string | null;
	createdAt: Date;

	sender: {
		id: string;
		name: string;
		username: string;
		image?: string | null;
	};

	reply: {
		id: string;
		key: string | null;
		type: MessageType;
		message?: string | null;

		sender: {
			id: string;
			name: string;
			username: string;
		};
	} | null;

	files: Array<{
		id: string;
		url: string;
		type: MessageFileType;
		key: string;
	}>;
}
