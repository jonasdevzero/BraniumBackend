import { Profile } from '@domain/models';

export interface LoadProfile {
	load(id: string): Promise<Profile>;
}
