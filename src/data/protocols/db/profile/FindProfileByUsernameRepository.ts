import { Profile } from '@domain/models';

export interface FindProfileByUsernameRepository {
	find(username: string): Promise<Profile | null>;
}
