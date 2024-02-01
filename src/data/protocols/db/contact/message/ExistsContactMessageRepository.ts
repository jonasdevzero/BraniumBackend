import { ExistsContactMessageDTO } from '@domain/dtos/contact';

export interface ExistsContactMessageRepository {
	exists(data: ExistsContactMessageDTO): Promise<boolean>;
}
