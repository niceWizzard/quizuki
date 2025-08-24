import { questionOptionTable, questionTable } from "@/db/question";
import { quizTable } from "@/db/schema";
import { DrizzleInstance } from "@/store/useDrizzleStore";
import {CreateQuiz, WholeQuiz} from "@/types/db";
import { eq } from "drizzle-orm";
import { SQLiteDatabase } from "expo-sqlite";
import {deleteFile} from "@/utils/download";

export class QuizRepository {
    constructor(private drizzle : DrizzleInstance, private sqlite : SQLiteDatabase) {}

    public async createQuiz(quiz : CreateQuiz, onProgressCb: () => void) {
        const db = this.drizzle;
        let createdId = -1;
        await this.sqlite.withTransactionAsync(async () => {
            quiz.id = undefined;
            const {quizId} = (await db.insert(quizTable).values({
                ...quiz,
            }).returning({quizId : quizTable.id}))[0];
            onProgressCb();
            for (const question of quiz.questions) {
                question.quizId = quizId;
                question.id = undefined;
                const {questionId} = (await db.insert(questionTable).values(question).returning({questionId : questionTable.id}))[0];
                onProgressCb();
                if(!question.options)
                    continue;
                for (const option of question.options) {
                    option.id = undefined;
                    option.questionId = questionId;
                    await db.insert(questionOptionTable).values(option);
                    onProgressCb();
                }
            }
            createdId = quizId;
        });
        return createdId;
    }

    public getQuizData(id : number) {
        return this.drizzle.query.quizTable.findFirst({
            where: eq(quizTable.id, id),
            with: {
                questions: {
                    with: {
                        options: true
                    }
                },
                play: true,
            },
        });
    }

    public getQuizzes()  {
        return this.drizzle.query.quizTable.findMany();
    }

    async deleteQuiz(quizId: number) {
        const filesToDelete: string[] = []

        const quiz = await this.getQuizData(quizId);
        if(!quiz) {
            throw new Error("Quiz not found while deleting!");
        }
        filesToDelete.push(quiz.image)

        quiz.questions.forEach(question => {
            question.images.forEach(image => filesToDelete.push(image));
            question.options.forEach(opt => opt.images.forEach(image => filesToDelete.push(image)));
        })

        await this.sqlite.withTransactionAsync(async () => {
            await this.drizzle.delete(quizTable).where(eq(quizTable.id, quizId));
        });

        for (const file of filesToDelete) {
            await deleteFile(file);
        }

    }
}