import { EditContactDTO } from '@domain/dtos/contact';

export interface EditContact {
	edit(data: EditContactDTO): Promise<void>;
}
