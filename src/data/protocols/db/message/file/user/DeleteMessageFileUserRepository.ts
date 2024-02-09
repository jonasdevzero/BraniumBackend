import { DeleteMessageFileUserDTO } from '@domain/dtos/message/file';

export interface DeleteMessageFileUserRepository {
	delete(data: DeleteMessageFileUserDTO): Promise<void>;
}
