import { CreateInviteDTO } from '@domain/dtos/invite';

export interface CreateInviteRepository {
	create(data: CreateInviteDTO): Promise<void>;
}
