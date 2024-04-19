import { LoadedContact, LoadedInvite, LoadedMessage } from '@domain/models';
import { RoomType } from '@domain/types';

export interface WebSocketEmitEvents {
	'invite:new': LoadedInvite;

	'contact:new': LoadedContact;

	'message:new': { message: LoadedMessage; roomId: string; type: RoomType };
	'message:edit': {
		messageId: string;

		text: string;
		updatedAt: Date;
	};
	'message:delete': string;
}
