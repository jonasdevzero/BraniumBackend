import { inject } from '@container';
import { controller, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { LoadContact } from '@domain/use-cases/contact';
import { response } from '@presentation/helpers';

@controller()
@route.get('contact', '/:profileId/:contactId')
export class LoadContactController implements Controller {
	constructor(
		@inject.usecase('LoadContact')
		private readonly loadContact: LoadContact
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId, contactId } = httpRequest.params;

		const result = await this.loadContact.load({
			userId: profileId,
			contactId,
		});

		return response.ok(result);
	}
}
