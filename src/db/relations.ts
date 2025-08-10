// Relations
import { questionOptionTable, questionTable } from "@/db/question";
import { quizTable } from "@/db/quiz";
import { relations } from "drizzle-orm";
import { playTable, questionResponseTable } from "./play";


export const quizRelations = relations(quizTable, ({ many, one }) => ({
    questions: many(questionTable, {
        relationName: "quiz_questions" // Add relation name
    }),
    play: one(playTable),
}));

export const questionRelations = relations(questionTable, ({ many, one }) => ({
    options: many(questionOptionTable),
    quiz: one(quizTable, {
        relationName: "quiz_questions", // Must match above
        fields: [questionTable.quizId], // Local field
        references: [quizTable.id],     // Foreign field
    }),
}));

export const questionOptionRelations = relations(questionOptionTable, ({ one }) => ({
    question: one(questionTable, {
        fields: [questionOptionTable.questionId],
        references: [questionTable.id],
    }),
}));


export const playRelations = relations(playTable, ({ many, one }) => ({
    quiz: one(quizTable, {
        fields: [playTable.quizId],
        references: [quizTable.id],
    }),
    questionResponses: many(questionResponseTable),
}));

export const questionResponseRelations = relations(questionResponseTable, ({ one }) => ({
    play: one(playTable, {
        fields: [questionResponseTable.playId],
        references: [playTable.id],
    }),
    question: one(questionTable, {
        fields: [questionResponseTable.questionId],
        references: [questionTable.id],
    }),
}));