import { ClipboardList, User } from "lucide-react";
import Icon from "./components/Icon";
import HomePage from "./components/pages/HomePage";
import QuestsPage from "./components/pages/QuestsPage";
import ProfilePage from "./components/pages/ProfilePage";
import { JSX } from "react";

export interface TabInfo {
	id: string;
	icon: JSX.Element;
	content: JSX.Element;
	default?: boolean;
}

const tabs = [
    {
        id: 'home',
        icon: <Icon type="house"/>,
        content: <HomePage/>,
        default: true
    },
    {
        id: 'quests',
        icon: <ClipboardList fill="var(--color-green-200)" stroke="var(--color-green-600)" strokeWidth={2.5}/>,
        content: <QuestsPage/>
    },
    {
        id: 'profile',
        icon: <User fill="var(--color-blue-300)" stroke="var(--color-blue-400)" strokeWidth={2.5}/>,
        content: <ProfilePage/>
    }
];
export default tabs;