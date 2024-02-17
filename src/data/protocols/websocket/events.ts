import { LoadedContact, LoadedInvite, LoadedMessage } from '@domain/models';

export interface WebSocketEmitEvents {
	'invite:new': LoadedInvite;

	'contact:new': LoadedContact;

	'contact:message:new': { contactId: string; message: LoadedMessage };
}
