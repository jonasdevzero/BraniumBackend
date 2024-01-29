import { LoadedInvite } from '@domain/models';
import { Paginated } from '@domain/types';

export interface ListInvitesDTO {
	profileId: string;

	page: number;
	limit: number;

	search?: string;
}

export type ListInvitesResultDTO = Paginated<LoadedInvite>;
