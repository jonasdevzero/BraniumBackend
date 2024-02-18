import { EmitMessageDTO } from '@domain/dtos/message';

export interface EmitMessage {
	emit(data: EmitMessageDTO): Promise<void>;
}
