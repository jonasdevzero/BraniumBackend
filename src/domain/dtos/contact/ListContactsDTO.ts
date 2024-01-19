import { LoadedContact } from '@domain/models';
import { Paginated } from '@domain/types';

export interface ListContactsDTO {
	profileId: string;

	page: number;
	limit: number;

	search?: string;
}

export type ListContactsResultDTO = Paginated<LoadedContact>;
