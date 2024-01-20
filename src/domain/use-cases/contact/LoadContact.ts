import { FindContactDTO } from '@domain/dtos/contact';
import { LoadedContact } from '@domain/models';

export interface LoadContact {
	load(data: FindContactDTO): Promise<LoadedContact>;
}
