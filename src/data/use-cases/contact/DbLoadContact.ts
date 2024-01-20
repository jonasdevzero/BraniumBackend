import { inject, injectable } from '@container';
import { GetFileUrlProvider, LoadContactRepository } from '@data/protocols';
import { FindContactDTO } from '@domain/dtos/contact';
import { LoadedContact } from '@domain/models';
import { LoadContact } from '@domain/use-cases/contact';
import { NotFoundError } from '@presentation/errors';

@injectable()
export class DbLoadContact implements LoadContact {
	constructor(
		@inject('LoadContactRepository')
		private readonly loadContactRepository: LoadContactRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async load(data: FindContactDTO): Promise<LoadedContact> {
		const contact = await this.loadContactRepository.load(data);

		if (!contact) {
			throw new NotFoundError('Contact');
		}

		if (!!contact.image) {
			const url = await this.getFileUrlProvider.get(contact.image);
			Object.assign(contact, { image: url });
		}

		return contact;
	}
}
