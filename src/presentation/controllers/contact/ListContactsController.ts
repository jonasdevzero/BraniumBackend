import { inject } from '@container';
import { controller, middlewares, route } from '@presentation/decorators';
import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols';
import { ListContacts } from '@domain/use-cases/contact';
import { response } from '@presentation/helpers';
import { ListContactsDTO } from '@domain/dtos/contact';
import { ListContactsValidator } from '@presentation/validators/contact';

@controller()
@middlewares(ListContactsValidator)
@route.get('contact', '/:profileId')
export class ListContactsController implements Controller {
	constructor(
		@inject.usecase('ListContacts')
		private readonly listContacts: ListContacts
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const { profileId } = httpRequest.params;
		const data = httpRequest.query as ListContactsDTO;

		Object.assign(data, { profileId });

		const result = await this.listContacts.list(data);

		return response.ok(result);
	}
}
