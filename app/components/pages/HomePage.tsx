'use client';
import sections from "@/lessons";
import { CirclePlay } from "lucide-react";
import React, { useState } from "react";
import CoursePage from "./CoursePage";

export default function HomePage() {
    const toRomanNumerals = (n: number): string => {
         //? Allows input from 1-39
        const romanNumerals: { value: number, numeral: string }[] = [{ value: 10, numeral: 'X' }, { value: 9, numeral: 'IX' }, { value: 5, numeral: 'V' }, { value: 4, numeral: 'IV' }, { value: 1, numeral: 'I' }];
        let result = '';
        for (const { value, numeral } of romanNumerals) {
            while (n >= value) {
                result += numeral;
                n -= value;
            }
        }
        return result;
    }
    const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const [currentCourse, setCurrentCourse] = useState<Course|undefined>();

    return currentCourse ? <CoursePage course={currentCourse} setCourse={setCurrentCourse}/> : (
        <div className="px-5">
            {sections.map(section => (<React.Fragment key={"section"+section.id}>
                <h1 className="text-2xl font-bold mt-6 mb-4">{toRomanNumerals(section.id+1)} - {section.title}</h1>
                {section.courses.map(course => (
                    <div key={`course${section.id}.${course.id}`} className="relative ml-2 px-5 bg-base-200 py-4 my-4">
                        <h2 className="text-lg font-semibold">{chars[course.id]}. {course.title}</h2>
                        <CirclePlay className="absolute right-4 top-1/2 -translate-y-1/2 stroke-gray-500 cursor-pointer" onClick={()=>setCurrentCourse(course)}/>
                    </div>
                ))}
            </React.Fragment>))}
        </div>
    )
}