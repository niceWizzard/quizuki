// Relations
import {relations} from "drizzle-orm";
import {questionOptionTable, questionTable} from "@/db/question";
import {quizTable} from "@/db/quiz";


export const quizRelations = relations(quizTable, ({ many }) => ({
    questions: many(questionTable, {
        relationName: "quiz_questions" // Add relation name
    }),
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

