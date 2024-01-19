import { EditProfileDTO } from '@domain/dtos/profile';

export interface EditProfileRepository {
	edit(data: EditProfileDTO): Promise<void>;
}
