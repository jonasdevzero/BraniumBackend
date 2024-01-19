import { inject, injectable } from '@container';
import { GetFileUrlProvider, ListContactsRepository } from '@data/protocols';
import { ListContactsDTO, ListContactsResultDTO } from '@domain/dtos/contact';
import { ListContacts } from '@domain/use-cases/contact';

@injectable()
export class DbListContacts implements ListContacts {
	constructor(
		@inject('ListContactsRepository')
		private readonly listContactsRepository: ListContactsRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async list(data: ListContactsDTO): Promise<ListContactsResultDTO> {
		const contacts = await this.listContactsRepository.list(data);

		await Promise.all(
			contacts.content.map(async (contact) => {
				if (!contact.image) return;

				const url = await this.getFileUrlProvider.get(contact.image);
				Object.assign(contact, { image: url });
			})
		);

		return contacts;
	}
}
