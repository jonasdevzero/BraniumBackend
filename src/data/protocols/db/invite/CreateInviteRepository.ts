import { CreateInviteDTO } from '@domain/dtos/invite';
import { LoadedInvite } from '@domain/models';

export interface CreateInviteRepository {
	create(data: CreateInviteDTO): Promise<LoadedInvite>;
}
