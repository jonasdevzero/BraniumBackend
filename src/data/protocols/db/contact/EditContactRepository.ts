import { EditContactDTO } from '@domain/dtos/contact';

export interface EditContactRepository {
	edit(data: EditContactDTO): Promise<void>;
}
