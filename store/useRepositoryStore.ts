import {QuizRepository} from "@/repository/quiz";
import {create} from "zustand";

interface UseRepositoryProps {
    quiz?: QuizRepository;
}


export const useRepositoryStore = create<UseRepositoryProps>((set) => {
    return {
    }
});






