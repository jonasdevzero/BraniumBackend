import { HttpRequest } from '../protocols';

export function getRequestData(httpRequest: HttpRequest, field: string) {
	return (
		httpRequest.body[field] ||
		httpRequest.params[field] ||
		httpRequest.query[field]
	);
}
