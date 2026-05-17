interface Lesson {
    id: number;
    type: 'lesson';
    content: string[];
}
interface FillExercise {
    id: number;
    type: 'fill_blanks';
    content: string[];
    answer: number;
}
interface ChooseExercise {
    id: number;
    type: 'choose';
    content: string[];
    options: string[];
    answer: number;
}
type Exercise = FillExercise|ChooseExercise;
interface Course {
    title: string;
    id: number;
    content: Array<Lesson|Exercise>;
}
interface Section {
    title: string;
    id: number;
    courses: Course[];
}