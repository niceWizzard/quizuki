import {
    ApiQuestion,
    ApiQuizSchema,
    BlankQuestion,
    MCQuestion,
    MSQuestion,
    Question, Quiz,
    UnsupportedQuestion
} from "@/types";
import {QuestionType} from "@/db/question";

export async function fetchQuiz(id : string)  {
    const res = await fetch('https://wayground.com/quiz/' + id, { method: 'GET' });
    const apiData = await res.json();
    if (!apiData.success) {
        throw new Error(`Error fetching quiz from api: ${apiData.message}`);
    }
    return apiData.data.quiz;
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

export async function parseApiData(data : any) {
    const schema = await ApiQuizSchema.parseAsync(data);
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
    } as Quiz;
}
