import { PlayRepository } from "@/repository/play";
import { QuizRepository } from "@/repository/quiz";
import { create } from "zustand";

interface UseRepositoryProps {
    quiz?: QuizRepository;
    play?: PlayRepository;
}


export const useRepositoryStore = create<UseRepositoryProps>((set) => {
    return {
    }
});






