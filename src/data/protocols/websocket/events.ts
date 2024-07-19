import { LoadedContact, LoadedInvite, LoadedMessage } from '@domain/models';
import { Call, RoomType } from '@domain/types';

export interface WebSocketEmitEvents {
	'invite:new': LoadedInvite;

	'contact:new': LoadedContact;
	'contact:block': { contactId: string; blocked: boolean };
	'contact:edit': { userId: string; name?: string; image?: string | null };

	'message:new': { message: LoadedMessage; roomId: string; type: RoomType };
	'message:edit': {
		messageId: string;

		text: string;
		updatedAt: Date;
	};
	'message:delete': string;

	'call:income': Call.Income;
	'call:canceled': string;
	'call:declined': string;
	'call:accepted': Call.Connection;
	'call:list-users': Call.ListUsers;
	'call:connection': Call.Connection;
	'call:ice-candidate': Call.IceCandidate;
	'call:leave': string;
}
