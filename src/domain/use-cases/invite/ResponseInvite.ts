import { ResponseInviteDTO } from '@domain/dtos/invite';

export interface ResponseInvite {
	response(data: ResponseInviteDTO): Promise<void>;
}
