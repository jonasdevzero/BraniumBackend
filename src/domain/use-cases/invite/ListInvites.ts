import { ListInvitesDTO, ListInvitesResultDTO } from '@domain/dtos/invite';

export interface ListInvites {
	list(data: ListInvitesDTO): Promise<ListInvitesResultDTO>;
}
