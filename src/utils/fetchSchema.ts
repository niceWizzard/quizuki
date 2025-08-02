import { z } from "zod";

// Base Schemas
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
        url: z.string(),
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
            url: z.string(),
        })),
    }),
    options: z.array(OptionSchema),
});

// Question Variants
const ApiMCQuestionSchema = ApiBaseQuestionSchema.extend({
    structure: BaseStructureSchema.extend({
        answer: z.number(),
    }),
    type: z.literal("MCQ"),
});

const APIBlankQuestionSchema = ApiBaseQuestionSchema.extend({
    structure: BaseStructureSchema.extend({
        answer: z.number(),
    }),
    type: z.literal("BLANK"),
});

const ApiMSQuestionSchema = ApiBaseQuestionSchema.extend({
    structure: BaseStructureSchema.extend({
        answer: z.array(z.number()),
    }),
    type: z.literal("MSQ"),
});

const ApiUnsupportedQuestionSchema = ApiBaseQuestionSchema.extend({
    type: z.literal("Unsupported"),
    structure: BaseStructureSchema,
});

// Raw Question Schema (for coercion)
const RawQuestionSchema = ApiBaseQuestionSchema.extend({
    structure: BaseStructureSchema.extend({
        answer: z.any().optional(),
    }),
});

// Coerce Unknown Types to Unsupported
const CoerceToApiQuestionSchema = RawQuestionSchema.transform((data) => {
    switch (data.type) {
        case "MCQ":
            return ApiMCQuestionSchema.parse(data);
        case "MSQ":
            return ApiMSQuestionSchema.parse(data);
        case "BLANK":
            return APIBlankQuestionSchema.parse(data);
        default:
            return ApiUnsupportedQuestionSchema.parse({
                ...data,
                type: "Unsupported",
                structure: { ...data.structure },
            });
    }
});

// Quiz Schema
export const ApiQuizSchema = z.object({
    deleted: z.boolean(),
    archived: z.boolean(),
    type: z.string(),
    _id: z.string(),
    info: z.object({
        lang: z.string(),
        __v: z.number(),
        _id: z.string(),
        questions: z.array(CoerceToApiQuestionSchema),
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

// Transformed Quiz Output
export const QuizSchema = ApiQuizSchema.transform((v) => ({
    id: v._id,
    name: v.info.name,
    createdBy: v.createdBy.firstName + " " + v.createdBy.lastName,
    createdAt: v.createdAt,
    updatedAt: v.createdAt,
    questions: v.info.questions,
    image: v.info.image,
}));
