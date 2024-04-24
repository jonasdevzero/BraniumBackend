import { inject, injectable } from '@container';
import {
	DeleteFileProvider,
	EditProfileRepository,
	FindProfileByIdRepository,
	GetFileUrlProvider,
	ListAllContactsRepository,
	UploadFileProvider,
	WebSocketServer,
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
		private readonly deleteFileProvider: DeleteFileProvider,

		@inject('ListAllContactsRepository')
		private readonly listAllContactsRepository: ListAllContactsRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
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

		await Promise.all([
			this.emitEvent(data),
			profile.image && image
				? this.deleteFileProvider.delete(profile.image)
				: null,
		]);
	}

	private async emitEvent(data: EditProfileDTO) {
		const { profileId, ...rest } = data;

		if (rest.image) {
			const url = await this.getFileUrlProvider.get(rest.image);
			Object.assign(rest, { image: url });
		}

		const contacts = await this.listAllContactsRepository.list(profileId);

		this.ws.emit(contacts, 'contact:edit', { ...rest, userId: profileId });
	}
}
