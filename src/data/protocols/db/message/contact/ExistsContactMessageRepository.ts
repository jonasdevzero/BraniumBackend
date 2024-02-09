import { ExistsContactMessageDTO } from '@domain/dtos/message/contact';

export interface ExistsContactMessageRepository {
	exists(data: ExistsContactMessageDTO): Promise<boolean>;
}
