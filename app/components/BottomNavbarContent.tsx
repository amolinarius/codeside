import { useEffect } from "react";
import { useTabContext } from "./TabContext";

export default function BottomNavbarContent() {
    const { activeTab, setActiveTab, tabs } = useTabContext();
    const handleTabChange = (tab: string) => setActiveTab(tab);
    useEffect(() => {
        if (!tabs.some(tab => tab.id == activeTab)) {handleTabChange(tabs.find(tab => tab.default)?.id ?? 'home')}
    }, [activeTab, tabs]);

    return tabs.map(tab => (
        <div key={tab.id} className={"w-8 h-8 flex justify-center items-center"+(tab.id==activeTab?" bg-cyan-600/20 border-cyan-500 border-2 rounded-md":"")} onClick={()=>handleTabChange(tab.id)}>
            {tab.icon}
        </div>
    ))
}