import { playTable } from "@/db/play";
import { questionTable } from "@/db/question";
import { quizTable } from "@/db/quiz";
import { DrizzleInstance } from "@/store/useDrizzleStore";
import { eq } from "drizzle-orm";
import {Play, Quiz} from "@/types/db";

export class PlayRepository {
    constructor(private drizzle: DrizzleInstance) {}

    private _activePlay?: Play;

    public get activePlay() {
        return this._activePlay;
    }

    public clearPlay() {
        this._activePlay = undefined;
    }

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
        const play = await this.drizzle.insert(playTable).values({
            quizId: quizId,
            questionOrder: quizData.questions.map(q => q.id).sort(() => Math.random() - 0.5),
        }).returning()

        this._activePlay = play[0];
    }


    public async getPlayQuestion(quizId : number, questionNumber: number) {
        try {
            const play = await this.drizzle.query.playTable.findFirst({
                where: eq(playTable.quizId, quizId)
            });

            return await this.drizzle.query.questionTable.findFirst({
                where: eq(questionTable.id, play!.questionOrder[questionNumber]),
                with: {
                    options: true,
                }
            });
        } catch (err) {
            return undefined;
        }
    }




}