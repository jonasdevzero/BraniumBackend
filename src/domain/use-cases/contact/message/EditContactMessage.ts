import { EditContactMessageDTO } from '@domain/dtos/contact';

export interface EditContactMessage {
	edit(data: EditContactMessageDTO): Promise<void>;
}
