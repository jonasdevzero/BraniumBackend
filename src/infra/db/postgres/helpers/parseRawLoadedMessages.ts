import { LoadedMessage, MessageFileType } from '@domain/models';
import { RawLoadedMessage } from '../types';

export function parseRawLoadedMessages(rows: RawLoadedMessage[]) {
	const messages: LoadedMessage[] = groupBy(rows, 'id').map((row) => {
		const {
			id,
			key,
			message,
			type,
			createdAt,
			updatedAt,
			sender_id,
			sender_name,
			sender_username,
			sender_image,

			reply_id,
			reply_key,
			reply_message,
			reply_type,
			reply_deleted,

			reply_sender_id,
			reply_sender_name,
			reply_sender_username,
		} = row[0];

		let reply = null;

		if (!!reply_id) {
			reply = {
				id: String(reply_id),
				key: reply_key || null,
				message: reply_message,
				type: reply_type,
				deleted: reply_deleted,

				sender: {
					id: reply_sender_id,
					name: reply_sender_name,
					username: reply_sender_username,
				},
			};
		}

		const files = groupBy(row, 'file_id')
			.filter((f) => f[0].file_messageId === id)
			.map((file) => {
				const { file_id, file_key, file_type, file_user_key } = file[0];

				return {
					id: String(file_id),
					url: String(file_key),
					type: String(file_type) as MessageFileType,
					key: String(file_user_key),
				};
			});

		return {
			id,
			key,
			message,
			type,
			createdAt,
			updatedAt,

			sender: {
				id: sender_id,
				name: sender_name,
				username: sender_username,
				image: sender_image,
			},

			reply,
			files,
		};
	});

	return messages;
}

function groupBy<D extends Array<any>>(data: D, key: keyof D[number]): D[] {
	return data.reduce((groups, current: D) => {
		const group = groups.find((g: any) => g[0][key] === current[key]);
		group ? group.push(current) : groups.push([current]);

		return groups;
	}, [] as unknown as D[]);
}
