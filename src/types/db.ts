import {playTable, quizTable} from "@/db/schema";
import {questionOptionTable, questionTable} from "@/db/question";


export type QuestionOptionInsert = typeof questionOptionTable.$inferInsert;
export type QuestionInsert = typeof questionTable.$inferInsert;
export type QuizInsert = typeof quizTable.$inferInsert;

export type CreateQuestion = QuestionInsert & {options: QuestionOptionInsert[]};
export type CreateQuiz = QuizInsert & {questions: CreateQuestion[]};


export type Quiz = typeof quizTable.$inferSelect;
export type QuizWithInfo = Quiz & {questionCount: number};
export type Question = typeof questionTable.$inferSelect;
export type QuestionOption = typeof questionOptionTable.$inferSelect;

export type WholeQuestion = Question & {options: QuestionOption[]};
export type WholeQuiz = Quiz & {questions : WholeQuestion[]};

export type Play = typeof playTable.$inferSelect;