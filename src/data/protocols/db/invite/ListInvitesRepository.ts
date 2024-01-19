import { ListInvitesDTO } from '@domain/dtos/invite';
import { LoadedInvite } from '@domain/models';

export interface ListInvitesRepository {
	list(data: ListInvitesDTO): Promise<LoadedInvite[]>;
}
