import { RoomType } from '@domain/types';

export type EmitMessageDTO = Array<{
	userId: string;
	messageId: string;

	roomId: string;
	type: RoomType;
}>;
