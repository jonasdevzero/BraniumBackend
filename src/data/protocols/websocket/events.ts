import { LoadedContact, LoadedInvite } from '@domain/models';

export interface WebSocketEmitEvents {
	'invite:new': LoadedInvite;

	'contact:new': LoadedContact;
}
