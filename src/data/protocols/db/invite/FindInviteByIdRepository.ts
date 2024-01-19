import { Invite } from '@domain/models';

export interface FindInviteByIdRepository {
	find(id: string): Promise<Invite | null>;
}
