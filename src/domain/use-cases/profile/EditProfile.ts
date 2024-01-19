import { EditProfileDTO } from '@domain/dtos/profile';
import { FileModel } from '@presentation/protocols';

export interface EditProfile {
	edit(data: EditProfileDTO, image: FileModel): Promise<void>;
}
