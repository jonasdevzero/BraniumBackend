import { MessageType } from '@domain/models';

export interface EditMessageDTO {
	id: string;

	message?: string;
	type?: MessageType;
}
