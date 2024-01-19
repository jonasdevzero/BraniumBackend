export interface Invite {
	senderId: string;
	receiverId: string;

	message?: string | null;

	createdAt: Date;
}

export interface LoadedInvite {
	id: string;
	message?: string | null;

	sender: {
		name: string;
		username: string;
		image?: string | null;
	};

	createdAt: Date;
}
