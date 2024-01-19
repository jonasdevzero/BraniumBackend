import { ExistsContactDTO } from '@domain/dtos/contact';

export interface ExistsContactRepository {
	exists(data: ExistsContactDTO): Promise<boolean>;
}
