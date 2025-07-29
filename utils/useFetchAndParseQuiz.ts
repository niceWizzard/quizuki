import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {z} from "zod";
import {QuestionType} from "@/db/question";

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

type ApiQuestion = z.infer<typeof ApiQuestionSchema>

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


export function useFetchAndParseQuiz(id : string) {
    const [status, setStatus] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);
    const { data,  error, refetch,isFetching,failureCount} = useQuery({
        queryKey: ['preview', id],
        enabled: isEnabled,
        queryFn: async () => {
            setStatus("Fetching...");
            const res = await fetch('https://wayground.com/quiz/' + id, { method: 'GET' });
            const apiData = await res.json();
            if (!apiData.success) {
                throw new Error(apiData.message);
            }
            setStatus("Parsing...");
            const data = await parseData(apiData.data.quiz);
            if (!data)
                throw new Error('Unable to parse.');
            return data;
        },
    });

    async function parseData(apiData: any) {
        const schema = await ApiQuizSchema.parseAsync(apiData);
        const questions = await parseQuestions(schema.info.questions);
        return {
            name: schema.info.name,
            archived: schema.archived,
            createdAt: schema.createdAt,
            updatedAt: schema.updated,
            createdBy: schema.createdBy.firstName + " " + schema.createdBy.lastName,
            onlineId: schema._id,
            image:  schema.info.image,
            questions,
        };
    }

    async function parseQuestions(schemaInfo: ApiQuestion[]) : Promise<Question[]> {
        return schemaInfo.map(v => {
            let type = QuestionType.Unsupported;
            switch (v.type.toLowerCase()) {
                case "blank":
                    type = QuestionType.Blank;
                    break;
                case "mcq":
                    type = QuestionType.MC;
                    break;
                case "msq":
                    type = QuestionType.MS;
                    break;
            }
            const base = {
                id: "none",
                onlineId: v._id,
                createdAt: v.createdAt,
                updatedAt: v.updated,
                text: v.structure.query.text,
                images: v.structure.query.media.map(a => a.url),
                type,
            };

            switch (type) {
                case QuestionType.Blank: {
                    const apiAnswer = v.structure.answer as number;
                    const answer = v.structure.options[apiAnswer].text;
                    return {
                        ...base,
                        answer,
                    } as BlankQuestion
                }
                case QuestionType.MC: {
                    const answer = v.structure.answer as number;
                    const options = v.structure.options.map(opt => ({
                        id: opt.id,
                        text: opt.text,
                        images: opt.media.map(v => ({url: v.url})),
                    }));
                    return {...base, answer, options} as MCQuestion;
                }
                case QuestionType.MS: {
                    const answer = v.structure.answer as number[];
                    const options = v.structure.options.map(opt => ({
                        id: opt.id,
                        text: opt.text,
                        images: opt.media.map(v => ({url: v.url})),
                    }));
                    return {...base, answer, options} as MSQuestion;
                }
                default:
                    return base as UnsupportedQuestion;
            }
        });
    }


    return {
        refetch,
        status,
        error,
        data,
        failureCount,
        setIsEnabled,
        isFetching,
    }
}