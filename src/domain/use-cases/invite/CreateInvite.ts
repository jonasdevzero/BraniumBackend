import { CreateInviteDTO } from '@domain/dtos/invite';

export interface CreateInvite {
	create(data: CreateInviteDTO): Promise<void>;
}
