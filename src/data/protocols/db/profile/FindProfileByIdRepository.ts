import { Profile } from '@domain/models';

export interface FindProfileByIdRepository {
	find(id: string): Promise<Profile | null>;
}
