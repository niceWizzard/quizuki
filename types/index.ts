import {QuestionType} from "@/db/question";
import {z} from "zod";


export const ApiMediaSchema = z.object({
    type: z.string(),
    url: z.string(),
})

export const ApiQuestionSchema = z.object({
    _id: z.string(),
    type: z.string(),
    structure: z.object({
        query: z.object({
            text: z.string(),
            media: z.array(ApiMediaSchema),
        }),
        options: z.array(z.object({
            type: z.string(),
            id: z.string(),
            text: z.string(),
            media: z.array(z.object({
                type: z.string(),
                url: z.string(),
            })),
        })),
        hints: z.array(z.object({
            text: z.string(),
            media: z.array(ApiMediaSchema)
        })),
        answer: z.union([z.array(z.number()), z.number()]).nullish(),
    }),
    createdAt: z.string(),
    updated: z.string(),
})


export const ApiQuizSchema = z.object({
    deleted: z.boolean(),
    archived: z.boolean(),
    type: z.string(),
    _id: z.string(),
    info: z.object({
        lang: z.string(),
        __v: z.number(),
        _id: z.string(),
        questions: z.array(ApiQuestionSchema),
        name: z.string(),
        image: z.string().nullish(),
        createdAt: z.string(),
        updated: z.string(),
        slug: z.string(),
    }),
    createdBy: z.object({
        firstName: z.string(),
        lastName: z.string(),
        id: z.string(),
    }),
    createdAt: z.string(),
    updated: z.string(),
});

export type ApiQuestion = z.infer<typeof ApiQuestionSchema>

export type BaseQuestion = {
    id: string;
    createdAt: string;
    updatedAt: string;
    text: string;
    images: string[];
    onlineId: string;
}
export type UnsupportedQuestion = BaseQuestion & {
    type: QuestionType.Unsupported;
}

export type BlankQuestion = BaseQuestion & {
    answer: string;
    type: QuestionType.Blank;
}

export type MCQuestion = BaseQuestion & {
    type: QuestionType.MC;
    options: {
        text: string;
        id: string;
        images : {
            url: string;
        }[]
    }[],
    answer: number;
}
export type MSQuestion = BaseQuestion & {
    type: QuestionType.MS;
    options: {
        text: string;
        id: string;
        images : {
            url: string;
        }[]
    }[],
    answer: number[];
}

export type Question = UnsupportedQuestion | MSQuestion | MCQuestion | BlankQuestion;
export type Quiz = {
    name: string,
    archived: boolean,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    onlineId: string,
    image:  string,
    questions : Question[],
}