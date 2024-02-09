import { DeleteMessageUserDTO } from '@domain/dtos/message/user';

export interface DeleteMessageUserRepository {
	delete(data: DeleteMessageUserDTO): Promise<void>;
}
