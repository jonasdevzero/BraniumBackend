import { ListInvitesDTO } from '@domain/dtos/invite';
import { LoadedInvite } from '@domain/models';

export interface ListInvites {
	list(data: ListInvitesDTO): Promise<LoadedInvite[]>;
}
