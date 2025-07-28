
import { z } from "zod";

const ApiBaseQuestionSchema = z.object({
    _id: z.string(),
    createdAt: z.string(),
    updated: z.string(),
    type: z.string(),
});

const OptionSchema = z.object({
    type: z.string(),
    id: z.string(),
    text: z.string(),
    media: z.array(z.object({
        type: z.string(),
        url: z.url(),
    })),
});

const BaseStructureSchema = z.object({
    hints: z.any(),
    kind: z.string(),
    explain: z.object({
        text: z.string(),
    }),
    query: z.object({
        text: z.string(),
        media: z.array(z.object({
            type: z.string(),
            url: z.url(),
        }))
    }),
    options: z.array(OptionSchema),
});


const ApiMCQuestionSchema = ApiBaseQuestionSchema.extend({
    structure: BaseStructureSchema.extend({
        answer: z.number(),
    }),
    type: z.literal("MCQ"),
});

const APIBlankQuestionSchema = ApiMCQuestionSchema.extend({
    type: z.literal("BLANK"),
})

const ApiMSQuestionSchema = ApiBaseQuestionSchema.extend({
    structure: BaseStructureSchema.extend({
        answer: z.array(z.number()),
    }),
    type: z.literal("MSQ"),
});

const ApiQuestionSchema = z.discriminatedUnion("type", [
   ApiMCQuestionSchema,
    ApiMSQuestionSchema,
    APIBlankQuestionSchema
]);


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

export const QuizSchema = ApiQuizSchema.transform(v => ({
    id: v._id,
    name: v.info.name,
    createdBy: v.createdBy.firstName + " " + v.createdBy.lastName,
    createdAt: v.createdAt,
    updatedAt: v.createdAt,
    questions: v.info.questions,
    image: v.info.image,
}));