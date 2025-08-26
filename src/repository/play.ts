import { playTable } from "@/db/play";
import { questionTable } from "@/db/question";
import { quizTable } from "@/db/quiz";
import { DrizzleInstance } from "@/store/useDrizzleStore";
import {asc, desc, eq} from "drizzle-orm";
import {ActivePlay} from "@/types/db";

export class PlayRepository {
    constructor(private drizzle: DrizzleInstance) {}

    private _activePlay?: ActivePlay;

    public get activePlay() {
        return this._activePlay;
    }

    public clearPlay() {
        this._activePlay = undefined;
    }

    public async activatePlay(quizId : number) {
        const play = await this.drizzle.query.playTable.findFirst({
            where: eq(playTable.quizId, quizId),
            with: {
                quiz: true,
            }
        })
        if(!play || !play.quiz) {
            throw new Error(`Play ${quizId} not found`);
        }
        this._activePlay = play as ActivePlay;
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
            throw new Error("Quiz not found!");
        // Delete old ones
        await this.drizzle.delete(playTable)
            .where(eq(playTable.quizId, quizId));
        // Create another play
        await this.drizzle.insert(playTable).values({
            quizId: quizId,
            questionOrder: quizData.questions.map(q => q.id).sort(() => Math.random() - 0.5),
        }).returning()
        const play = await this.drizzle.query.playTable.findFirst({
            where: eq(playTable.quizId, quizId),
            with: {
                quiz: true,
            }
        })
        const quiz = play?.quiz;
        if(!quiz || !play)
            throw new Error("Quiz not found!")
        this._activePlay = {...play, quiz};
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

    public getAllPlays() {
        return this.drizzle.query.playTable.findMany({
          orderBy: desc(playTable.updatedAt),
            with: {
              quiz: true,
            }
        })
    }


}