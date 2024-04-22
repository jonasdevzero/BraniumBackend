import { inject, injectable } from '@container';
import { EditContactRepository, WebSocketServer } from '@data/protocols';
import { EditContactDTO } from '@domain/dtos/contact';
import { EditContact } from '@domain/use-cases/contact';

@injectable()
export class DbEditContact implements EditContact {
	constructor(
		@inject('EditContactRepository')
		private readonly editContactRepository: EditContactRepository,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
	) {}

	async edit(data: EditContactDTO): Promise<void> {
		const { contactId, profileId, blocked } = data;

		await this.editContactRepository.edit(data);

		if (typeof blocked === 'boolean')
			this.ws.emit([contactId], 'contact:block', {
				contactId: profileId,
				blocked,
			});
	}
}
