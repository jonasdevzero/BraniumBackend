import { ListContactsDTO, ListContactsResultDTO } from '@domain/dtos/contact';

export interface ListContactsRepository {
	list(data: ListContactsDTO): Promise<ListContactsResultDTO>;
}
