import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

enum QuestionType {
    Blank = "blank",
    MC = "mc",
    MS = "ms",
    Unsupported = "unsupported",
}

const typeEnumColumn = text("type", {
    enum: [
        QuestionType.Blank,
        QuestionType.MC,
        QuestionType.MS,
        QuestionType.Unsupported,
    ]
}).notNull();

function baseQuestionColumns(type: QuestionType) {
    return {
        id: integer("id").primaryKey(),
        onlineId: text("online_id", { length: 255 }).notNull(),
        text: text("text").notNull(),
        createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
        updatedAt: integer("updated_at", { mode: 'timestamp_ms' }).notNull().$onUpdate(() => sql`CURRENT_TIMESTAMP`),
        type: typeEnumColumn.default(type),
    };
}

export const unsupportedQuestionTable = sqliteTable("unsupported_questions", {
    ...baseQuestionColumns(QuestionType.Unsupported),
});

export const blankQuestionTable = sqliteTable("blank_questions", {
    ...baseQuestionColumns(QuestionType.Blank),
    answer: text("answer", { length: 255 }).notNull(),
});

export const mcQuestionTable = sqliteTable("mc_questions", {
    ...baseQuestionColumns(QuestionType.MC),
});

export const msQuestionTable = sqliteTable("ms_questions", {
    ...baseQuestionColumns(QuestionType.MS),
});
