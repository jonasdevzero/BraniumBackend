import { ListProfilesDTO, ListProfilesResultDTO } from '@domain/dtos/profile';

export interface ListProfilesRepository {
	list(data: ListProfilesDTO): Promise<ListProfilesResultDTO>;
}
