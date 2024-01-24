import { ListProfilesDTO, ListProfilesResultDTO } from '@domain/dtos/profile';

export interface ListProfiles {
	list(data: ListProfilesDTO): Promise<ListProfilesResultDTO>;
}
