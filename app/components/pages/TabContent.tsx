'use client';
import { useTabContext } from "../TabContext";

export default function TabContent() {
    const { activeTab, tabs } = useTabContext();
    return (
        <div className="w-full h-full max-w-4xl mx-auto *:w-full *:h-full *:max-w-xl *:mx-auto *:py-10">
            {tabs.find(t => t.id == activeTab)?.content ?? 'Tab not found'}
        </div>
    );
}