import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { customJsonb, questionTable } from "./question";
import { quizTable } from "./quiz";

export const playTable = sqliteTable('plays', {
    id: integer('id').primaryKey({autoIncrement: true}),
    quizId: integer('quiz_id').references(() => quizTable.id, {onDelete: 'cascade'}),
    questionOrder : customJsonb<number[]>('question_order').notNull(),
    startedAt: integer('started_at', {mode: 'timestamp'}).notNull().default(new Date()),
    updatedAt: integer('updated_at', {mode: 'timestamp'}).notNull().$onUpdate(() => new Date()),
});

export const questionResponseTable = sqliteTable('question_responses', {
    id: integer('id').primaryKey({autoIncrement: true}),
    playId: integer('play_id').references(() => playTable.id, {onDelete: 'cascade'}),
    questionId: integer('question_id').references(() => questionTable.id, {onDelete: 'cascade'}),
    isCorrect: integer('is_correct', {mode: 'boolean'}).notNull(),
    answerBlank: text("answer_blank", { length: 255 }),
    answerMultipleChoice: integer("answer_multiple_choice"),
    answerMultipleSelection: customJsonb<number[]>('answer_multiple_selection'),
});


