import { FindContactDTO } from '@domain/dtos/contact';
import { LoadedContact } from '@domain/models';

export interface LoadContactRepository {
	load(data: FindContactDTO): Promise<LoadedContact | null>;
}
