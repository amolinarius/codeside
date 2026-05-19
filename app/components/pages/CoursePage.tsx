'use client';
import { getMetadataProperty, incrementMetadataProperty, reloadPage, setMetadataProperty } from "@/app/actions";
import { useUser } from "@clerk/nextjs";
import { CircleCheck, CircleX, PartyPopper, Sparkles, Zap } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Markdown, { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CourseStats {
    earnedXp: number;
    successRate: number;
    completedExercises: number;
    startingTime: number;
}
type BoxList = [string, string, any][];

const markdownComponents: Components = {
    code: ({ className, children }) => {
        const match = /language-(\w+)/.exec(className || '');
        return match ? 
            <SyntaxHighlighter PreTag="div" language={match[1]} style={oneLight}>{String(children)}</SyntaxHighlighter> : 
            <SyntaxHighlighter PreTag="span" language="python" style={oneLight} customStyle={{ padding: 5}}>{String(children)}</SyntaxHighlighter>;
        // <code className={className}>{children}</code>
    },
}

export default function CoursePage({ course, setCourse }: { course: Course, setCourse: Dispatch<SetStateAction<Course|undefined>> }) {
    const [lesson, setLesson] = useState<Lesson|Exercise|undefined>(course.content[0]);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<{ show: boolean, right: boolean }>({ show: false, right: false });
    const [selectedOption, setSelectedOption] = useState<string|undefined>();
    const [stats, setStats] = useState<CourseStats>({ earnedXp: 0, successRate: 0, completedExercises: 0, startingTime: Date.now() });
    const _user = useUser();
    if (!_user.isLoaded || !_user.isSignedIn) return <div>Not authenticated</div>;
    const { user } = _user;
    
    const shuffleArray = (arr: any[]) => arr.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
    const getRandomItem = (arr: any[]) => arr[arr.length * Math.random() | 0];
    useEffect(() => {
        if (lesson && lesson.type == "choose") setShuffledOptions(shuffleArray(lesson!.options));
    }, [lesson]);

    const handleNextClick = async () => {
        if (lesson == undefined) {
            incrementMetadataProperty(user.id, "public", "total_xp", 0, stats.earnedXp);
            const lastLesson = new Date(new Date(await getMetadataProperty(user.id, "public", "last_lesson", 0)).toDateString()); //? Only keep day/month/year
            const now = new Date(new Date().toDateString());
            console.log(lastLesson, now, lastLesson.getTime(), now.getTime(), now.getTime() - lastLesson.getTime() >= 864e5);
            if (now.getTime() - lastLesson.getTime() >= 864e5) { //? If last lesson was at least the day before
                incrementMetadataProperty(user.id, "public", "streak", 0, 1);
                //TODO Show a "streak extended" component
            }
            await setMetadataProperty(user.id, "public", "last_lesson", now);
            await reloadPage();
            setCourse(undefined);
            return;
        }
        if (lesson.type == "choose") {
            const isRight = selectedOption != undefined && lesson.answer === lesson.options.indexOf(selectedOption);
            if (!feedback.show) {
                setFeedback({ show: true, right: isRight });
                return;
            }
            setStats({
                ...stats,
                earnedXp: stats.earnedXp + (isRight ? 5 : 0),
                completedExercises: stats.completedExercises + 1,
                successRate: (stats.successRate * stats.completedExercises + (isRight?1:0)) / (stats.completedExercises + 1)
            });
        }
        setFeedback({ show: false, right: false });
        setSelectedOption(undefined);
        const nextLesson = course.content.find(l => l.id == lesson.id + 1);
        setLesson(nextLesson);
    }
    const FormattedOptions = () => {
        switch (lesson!.type) {
            case "choose": return (
                <div className="flex flex-col gap-2 mt-8">
                    {shuffledOptions.map(option => (
                        <button className={"btn markdown h-auto min-h-10"+(selectedOption==option ? " bg-blue-100 border-blue-400" : "")} key={option} onClick={() => {if (!feedback.show) setSelectedOption(option);}}>
                            <Markdown components={markdownComponents}>{option}</Markdown>
                        </button>
                    ))}
                </div>
            );
            case "fill_blanks": return ""; //TODO Handle fill_blanks exercises
            default: return "";
        }
    }
    const getCompletionMessage = (right: boolean = feedback.right): string => {
        const rightMessages = ["Bien joué", "Bravo", "Félicitations", "Excellent", "Parfait"].map(msg => msg+" !");
        const wrongMessages = ["Dommage", "Presque !"];
        return right ? getRandomItem(rightMessages) : getRandomItem(wrongMessages);
    }

    if (lesson == undefined) {
        return (
            <div className="relative not-sm:fixed not-sm:inset-0 bg-white z-50 flex flex-col justify-center items-center">
                <h1 className="text-3xl font-semibold mb-8">{getCompletionMessage(true)}</h1>
                <div className="flex flex-row">
                    {
                        ([
                            ["bg-yellow-400", "XP Gagné", stats.earnedXp],
                            ["bg-green-400", "Taux de réussite", stats.successRate*100 + "%"],
                            ["bg-blue-400", "Temps écoulé", Math.round((Date.now() - stats.startingTime)/1000) + "s"]
                        ] as BoxList)
                        .map(box => (
                            <div className={box[0] + " p-2 pt-1 mx-2 rounded-lg"} key={box[1]}>
                                <span className="text-sm">{box[1]}</span>
                                <div className="bg-white rounded-lg text-center">
                                    {box[2]}
                                </div>
                            </div>
                        ))
                    }
                </div>
                <button className="btn btn-primary absolute bottom-4 left-4 right-4" onClick={handleNextClick}>Terminer</button>
            </div>
        );
    }
    return (
        <div className="relative not-sm:fixed not-sm:inset-0 bg-white z-50">
            <progress className="progress absolute left-4 right-4 w-auto h-3 top-8" value={lesson.id+1} max={course.content.length+1}></progress>
            <div className="p-8">
                <div className="markdown">
                    <Markdown components={markdownComponents}>{lesson.content.join('\n')}</Markdown>
                </div>
                <FormattedOptions />
            </div>
            {
                feedback.show && (
                    <div className={(feedback.right ? "bg-green-200" : "bg-red-200")+" absolute bottom-0 left-0 right-0 px-4 pb-18 pt-4 flex items-center justify-between sm:rounded-t-lg"}>
                        <div className={(feedback.right ? "text-green-600" : "text-red-600")+" text-2xl *:inline"}>
                            {feedback.right ? getRandomItem([<Sparkles/>, <PartyPopper/>, <CircleCheck/>]) : <CircleX/>} {getCompletionMessage()}
                        </div>
                        {feedback.right && <div className="badge animate-scale"><Zap width={16}/> +5 XP</div>}
                    </div>
                )
            }
            <button className="btn btn-primary absolute bottom-4 left-4 right-4" disabled={lesson.type!="lesson"&&selectedOption==undefined} onClick={handleNextClick}>{lesson.type == 'lesson' ? 'Suivant' : 'Valider'}</button>
        </div>
    );
}