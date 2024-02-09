import { ExistsMessageUserDTO } from '@domain/dtos/message/user';

export interface ExistsMessageUserRepository {
	exists(data: ExistsMessageUserDTO): Promise<boolean>;
}
