import { customType, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import {quizTable} from "@/db/quiz";

// Question Types Enum
export enum QuestionType {
    Blank = "blank",
    MC = "mc",
    MS = "ms",
    Unsupported = "unsupported",
}

// JSONB Custom Type for SQLite
const customJsonb = <TData>(name: string) =>
    customType<{ data: TData; driverData: string }>({
        dataType() {
            return 'jsonb';
        },
        toDriver(value: TData): string {
            return JSON.stringify(value);
        },
        fromDriver(value: string): TData {
            return JSON.parse(value);
        }
    })(name);

// Questions Table
export const questionTable = sqliteTable('questions', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quizId: integer("quiz_id").references(() => quizTable.id, { onDelete: 'cascade' }).notNull(),
    type: text("type", {
        enum: [
            QuestionType.Blank,
            QuestionType.MC,
            QuestionType.MS,
            QuestionType.Unsupported,
        ]
    }).notNull(),
    onlineId: text("online_id", { length: 255 }).notNull(),
    text: text("text").notNull(),
    createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(new Date()),
    updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$onUpdate(() => new Date()),
    answerBlank: text("answer_blank", { length: 255 }),
    answerMultipleChoice: integer("answer_multiple_choice"),
    answerMultipleSelection: customJsonb<number[]>('answer_multiple_selection'),
    images: customJsonb<string[]>('images').notNull(),
});

// Question Options Table (One-to-Many)
export const questionOptionTable = sqliteTable('question_options', {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: integer("question_id")
        .notNull()
        .references(() => questionTable.id, { onDelete: 'cascade' }),
    text: text("text").notNull(),
    images: customJsonb<string[]>('images').notNull(),
});



// Type Inference
export type Question = typeof questionTable.$inferSelect;
export type QuestionOption = typeof questionOptionTable.$inferSelect;
