import { inject, injectable } from '@container';
import {
	DeleteFileProvider,
	EditProfileRepository,
	FindProfileByIdRepository,
	UploadFileProvider,
} from '@data/protocols';
import { EditProfileDTO } from '@domain/dtos/profile';
import { EditProfile } from '@domain/use-cases/profile';
import { NotFoundError } from '@presentation/errors';
import { FileModel } from '@presentation/protocols';

@injectable()
export class DbEditProfile implements EditProfile {
	constructor(
		@inject('FindProfileByIdRepository')
		private readonly findProfileByIdRepository: FindProfileByIdRepository,

		@inject('UploadFileProvider')
		private readonly uploadFileProvider: UploadFileProvider,

		@inject('EditProfileRepository')
		private readonly editProfileRepository: EditProfileRepository,

		@inject('DeleteFileProvider')
		private readonly deleteFileProvider: DeleteFileProvider
	) {}

	async edit(data: EditProfileDTO, image?: FileModel): Promise<void> {
		const { profileId } = data;

		const profile = await this.findProfileByIdRepository.find(profileId);

		if (!profile) {
			throw new NotFoundError('profile');
		}

		if (image) {
			const key = await this.uploadFileProvider.upload(image);
			Object.assign(data, { image: key });
		}

		await this.editProfileRepository.edit(data);

		if (!!profile.image && !!image)
			await this.deleteFileProvider.delete(profile.image);
	}
}
