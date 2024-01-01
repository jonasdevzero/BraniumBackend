import { CreateProfileDTO } from '@domain/dtos/profile';

export interface CreateProfileRepository {
	create(data: CreateProfileDTO): Promise<void>;
}
