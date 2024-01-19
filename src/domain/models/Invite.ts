export interface Invite {
	senderId: string;
	receiverId: string;

	message?: string;

	createdAt: Date;
}
