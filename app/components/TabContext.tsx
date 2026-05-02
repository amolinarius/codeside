'use client';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import tabs, { TabInfo } from "../tabs";

export const TabContext = createContext<{ activeTab: string, setActiveTab: Dispatch<SetStateAction<string>>, tabs: TabInfo[] }|undefined>(undefined);
export function useTabContext() {
    const context = useContext(TabContext);
    if (!context) {throw new Error('useTabContext must be used within TabProvider')}
    return context;
}
export default function TabContextProvider({ children }: { children: React.ReactNode }) {
    const [activeTab, setActiveTab] = useState<string>('home');
    return <TabContext.Provider value={{ activeTab, setActiveTab, tabs }}>{children}</TabContext.Provider>;
}