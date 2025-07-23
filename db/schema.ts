import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const quizTable = sqliteTable('quizzes', {
   id: integer('id').primaryKey({autoIncrement: true}),
   name: text('name', {length: 255}).notNull(),
    waygroundId: text('wayground_id', {length: 255}).notNull(),
});