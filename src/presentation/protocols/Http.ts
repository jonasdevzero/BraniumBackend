import { IncomingHttpHeaders } from 'http';
import { FileModel } from './Upload';

export interface HttpRequest {
	body?: any;
	files: Record<string, FileModel[]>;
	query: Record<string, any>;
	params: Record<string, string>;
	headers: IncomingHttpHeaders;
	user: {
		id: string;
	};
}

export interface HttpResponse {
	body?: any;
	statusCode: number;
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
