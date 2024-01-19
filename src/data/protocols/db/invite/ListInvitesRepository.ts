import { ListInvitesDTO, ListInvitesResultDTO } from '@domain/dtos/invite';

export interface ListInvitesRepository {
	list(data: ListInvitesDTO): Promise<ListInvitesResultDTO>;
}
