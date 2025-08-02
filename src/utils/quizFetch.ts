import {
    ApiQuestion,
    ApiQuizSchema,
} from "@/types";
import {QuestionType} from "@/db/question";
import {CreateQuestion, CreateQuiz, Question, QuestionInsert, QuizInsert} from "@/types/db";

export async function fetchQuiz(id : string)  {
    const res = await fetch('https://wayground.com/quiz/' + id, { method: 'GET' });
    const apiData = await res.json();
    if (!apiData.success) {
        throw new Error(`Error fetching quiz from api: ${apiData.message}`);
    }
    return apiData.data.quiz;
}

async function parseQuestions(schemaInfo: ApiQuestion[]){
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
            quizId: 69,
            onlineId: v._id,
            createdAt: new Date(v.createdAt),
            updatedAt: new Date(v.updated),
            text: v.structure.query.text,
            images: v.structure.query.media.map(a => a.url),
            type,
        } as CreateQuestion;



        switch (type) {
            case QuestionType.Blank: {
                const apiAnswer = v.structure.answer as number;
                const answer = v.structure.options[apiAnswer].text;
                return {
                    ...base,
                    answerBlank: answer,
                } as CreateQuestion
            }
            case QuestionType.MC: {
                const answer = v.structure.answer as number;
                const options = v.structure.options.map(opt => ({
                    text: opt.text,
                    images: opt.media.map(v => v.url),
                    questionId: 69,
                })) ;
                return {
                    ...base,
                    answerMultipleChoice: answer,
                    options,
                } as CreateQuestion;
            }
            case QuestionType.MS: {
                const answer = v.structure.answer as number[];
                const options = v.structure.options.map(opt => ({
                    text: opt.text,
                    images: opt.media.map(v => v.url),
                    questionId: 69,
                }));
                return {...base, answerMultipleSelection: answer, options} as CreateQuestion;
            }
            default:
                return base as CreateQuestion;
        }
    });
}

export async function parseApiData(data : any) {
    const schema = await ApiQuizSchema.parseAsync(data);
    const questions = await parseQuestions(schema.info.questions);
    return {
        name: schema.info.name,
        archived: schema.archived,
        createdAt: new Date(schema.createdAt),
        updatedAt: new Date(schema.updated),
        createdBy: schema.createdBy.firstName + " " + schema.createdBy.lastName,
        onlineId: schema._id,
        image:  schema.info.image,
        questions,
    } as CreateQuiz;
}
