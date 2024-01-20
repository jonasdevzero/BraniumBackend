import { inject, injectable } from '@container';
import { EditContactRepository } from '@data/protocols';
import { EditContactDTO } from '@domain/dtos/contact';
import { EditContact } from '@domain/use-cases/contact';

@injectable()
export class DbEditContact implements EditContact {
	constructor(
		@inject('EditContactRepository')
		private readonly editContactRepository: EditContactRepository
	) {}

	async edit(data: EditContactDTO): Promise<void> {
		await this.editContactRepository.edit(data);
	}
}
