import { playTable } from "@/db/play";
import { questionTable } from "@/db/question";
import { quizTable } from "@/db/quiz";
import { DrizzleInstance } from "@/store/useDrizzleStore";
import { eq } from "drizzle-orm";

export class PlayRepository {
    constructor(private drizzle: DrizzleInstance) {}

    public async createPlay(quizId : number) {
        const quizData = await this.drizzle.query.quizTable.findFirst({
            where: eq(quizTable.id, quizId),
            with: {
                questions: {
                    columns: {
                        id: true,
                    }
                }
            }
        });
        if(!quizData)
            throw new Error("Quiz not found!")
        await this.drizzle.insert(playTable).values({
            quizId: quizId,
            questionOrder: quizData.questions.map(q => q.id).sort(() => Math.random() - 0.5),
        })
    }


    public async getPlayQuestion(quizId : number, questionNumber: number) {
        try {
            const play = await this.drizzle.query.playTable.findFirst({
                where: eq(playTable.quizId, quizId)
            });

            return await this.drizzle.query.questionTable.findFirst({
                where: eq(questionTable.id, play!.questionOrder[questionNumber])
            });
        } catch (err) {
            return undefined;
        }
    }


}