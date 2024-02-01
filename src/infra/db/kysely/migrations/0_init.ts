import { Kysely, sql } from 'kysely';
import { Database } from '../types/Database';

export async function up(db: Kysely<Database>): Promise<void> {
	await db.schema
		.createTable('profile')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('username', 'text', (col) => col.notNull().unique())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('image', 'text')
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('updatedAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();

	await db.schema
		.createTable('invite')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('senderId', 'uuid', (col) => col.notNull())
		.addColumn('receiverId', 'uuid', (col) => col.notNull())
		.addColumn('message', 'text')
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addForeignKeyConstraint(
			'fk_invite_sender',
			['senderId'],
			'profile',
			['id'],
			(cb) => cb.onUpdate('cascade').onDelete('cascade')
		)
		.addForeignKeyConstraint(
			'fk_invite_receiver',
			['receiverId'],
			'profile',
			['id'],
			(cb) => cb.onUpdate('cascade').onDelete('cascade')
		)
		.execute();

	await db.schema
		.createTable('contact')
		.ifNotExists()
		.addColumn('userId', 'uuid', (col) => col.notNull())
		.addColumn('contactId', 'uuid', (col) => col.notNull())
		.addColumn('name', 'text')
		.addColumn('blocked', 'boolean', (col) => col.notNull().defaultTo(false))
		.addColumn('createdAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`now()`)
		)
		.addPrimaryKeyConstraint('pk_contact', ['userId', 'contactId'])
		.addForeignKeyConstraint(
			'fk_contact_user',
			['userId'],
			'profile',
			['id'],
			(cb) => cb.onUpdate('cascade').onDelete('cascade')
		)
		.addForeignKeyConstraint(
			'fk_contact_contact',
			['contactId'],
			'profile',
			['id'],
			(cb) => cb.onUpdate('cascade').onDelete('cascade')
		)
		.execute();

	await db.schema
		.createTable('group')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('image', 'text')
		.addColumn('description', 'text')
		.addColumn('createdAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`now()`)
		)
		.addColumn('updatedAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`now()`)
		)
		.execute();

	await db.schema
		.createType('GroupUserRole')
		.asEnum(['OWNER', 'ADMIN', 'ROLE'])
		.execute();

	await db.schema
		.createTable('groupUser')
		.ifNotExists()
		.addColumn('groupId', 'uuid', (col) => col.notNull())
		.addColumn('userId', 'uuid', (col) => col.notNull())
		.addColumn('role', sql`"GroupUserRole"`, (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) =>
			col.notNull().defaultTo(sql`now()`)
		)
		.addPrimaryKeyConstraint('pk_groupUser', ['groupId', 'userId'])
		.addForeignKeyConstraint('fk_groupUser_group', ['groupId'], 'group', ['id'])
		.addForeignKeyConstraint('fk_groupUser_user', ['userId'], 'profile', ['id'])
		.execute();

	await db.schema
		.createType('MessageType')
		.asEnum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'MIX'])
		.execute();

	await db.schema
		.createTable('message')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('senderId', 'uuid', (col) => col.notNull())
		.addColumn('replyId', 'uuid')
		.addColumn('groupId', 'uuid')
		.addColumn('message', 'text')
		.addColumn('type', sql`"MessageType"`, (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('updatedAt', 'timestamp')
		.addForeignKeyConstraint('fk_message_sender', ['senderId'], 'profile', [
			'id',
		])
		.addForeignKeyConstraint('fk_message_reply', ['replyId'], 'message', ['id'])
		.addForeignKeyConstraint('fk_message_group', ['groupId'], 'group', ['id'])
		.execute();

	await db.schema
		.createTable('messageUser')
		.ifNotExists()
		.addColumn('messageId', 'uuid', (col) => col.notNull())
		.addColumn('userId', 'uuid', (col) => col.notNull())
		.addColumn('key', 'text', (col) => col.notNull())
		.addPrimaryKeyConstraint('pk_messageUser', ['messageId', 'userId'])
		.addForeignKeyConstraint(
			'fk_messageUser_message',
			['messageId'],
			'message',
			['id']
		)
		.addForeignKeyConstraint('fk_messageUser_user', ['userId'], 'profile', [
			'id',
		])
		.execute();

	await db.schema
		.createType('MessageFileType')
		.asEnum(['IMAGE', 'VIDEO', 'AUDIO', 'FILE'])
		.execute();

	await db.schema
		.createTable('messageFile')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('messageId', 'uuid', (col) => col.notNull())
		.addColumn('key', 'text', (col) => col.notNull())
		.addColumn('type', sql`"MessageFileType"`, (col) => col.notNull())
		.addForeignKeyConstraint(
			'fk_messageFile_message',
			['messageId'],
			'message',
			['id']
		)
		.execute();

	await db.schema
		.createTable('messageFileUser')
		.ifNotExists()
		.addColumn('fileId', 'uuid', (col) => col.notNull())
		.addColumn('userId', 'uuid', (col) => col.notNull())
		.addColumn('key', 'text', (col) => col.notNull())
		.addPrimaryKeyConstraint('pk_messageFileUser', ['fileId', 'userId'])
		.addForeignKeyConstraint(
			'fk_messageFileUser_file',
			['fileId'],
			'messageFile',
			['id']
		)
		.addForeignKeyConstraint('fk_messageFileUser_user', ['userId'], 'profile', [
			'id',
		])
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable('messageFileUser').ifExists().execute();
	await db.schema.dropTable('messageFile').ifExists().execute();
	await db.schema.dropType('MessageFileType').ifExists().execute();

	await db.schema.dropTable('messageUser').ifExists().execute();
	await db.schema.dropTable('message').ifExists().execute();
	await db.schema.dropType('MessageType').ifExists().execute();

	await db.schema.dropTable('groupUser').ifExists().execute();
	await db.schema.dropType('GroupUserRole').ifExists().execute();
	await db.schema.dropTable('group').ifExists().execute();

	await db.schema.dropTable('contact').ifExists().execute();
	await db.schema.dropTable('invite').ifExists().execute();
	await db.schema.dropTable('profile').ifExists().execute();
}
