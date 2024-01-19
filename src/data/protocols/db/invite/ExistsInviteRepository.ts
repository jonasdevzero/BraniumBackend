import { ExistsInviteDTO } from '@domain/dtos/invite';

export interface ExistsInviteRepository {
	exists(data: ExistsInviteDTO): Promise<boolean>;
}
