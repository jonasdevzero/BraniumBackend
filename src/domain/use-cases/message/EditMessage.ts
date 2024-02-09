import { EditMessageDTO } from '@domain/dtos/message';

export interface EditMessage {
	edit(data: EditMessageDTO, profileId: string): Promise<void>;
}
