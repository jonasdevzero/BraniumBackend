import { ListContactsDTO, ListContactsResultDTO } from '@domain/dtos/contact';

export interface ListContacts {
	list(data: ListContactsDTO): Promise<ListContactsResultDTO>;
}
