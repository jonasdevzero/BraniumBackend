import { CreateProfileDTO } from '@domain/dtos/profile';
import { FileModel } from '@presentation/protocols';

export interface CreateProfile {
	create(data: CreateProfileDTO, image: FileModel): Promise<void>;
}
