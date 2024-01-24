import { Profile } from '@domain/models';
import { Paginated } from '@domain/types';

export interface ListProfilesDTO {
	profileId: string;

	page: number;
	limit: number;

	search?: string;
}

export type ListProfilesResultDTO = Paginated<Profile>;
