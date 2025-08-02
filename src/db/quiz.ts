import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";

export const quizTable = sqliteTable('quizzes', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name', {length: 255}).notNull(),
    onlineId: text('online_id', {length: 255}).notNull(),
    image : text('image', {length: 255}).notNull(),
});
