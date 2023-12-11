import { Generated } from 'kysely';

type UserTable = {
	id: string;

	name: string;
	image?: string | null;
	email: string;
	username: string;
	password: string;

	createdAt: Generated<Date>;
	updatedAt: Generated<Date>;
	deletedAt?: Generated<Date>;
};

export interface Database {
	user: UserTable;
}
