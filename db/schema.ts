import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export {blankQuestionTable, mcQuestionTable,msQuestionTable,unsupportedQuestionTable} from './question'

export const quizTable = sqliteTable('quizzes', {
   id: integer('id').primaryKey({autoIncrement: true}),
   name: text('name', {length: 255}).notNull(),
    waygroundId: text('wayground_id', {length: 255}).notNull(),
});

export type Quiz = typeof quizTable.$inferSelect;