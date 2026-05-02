'use server';
import { getMetadataProperty, log, LogType } from "./actions";
import LoginModal from "./components/LoginModal";
import BottomNavbar from "./components/BottomNavbar";
import TopNavbar from "./components/TopNavbar";
import { currentUser } from "@clerk/nextjs/server";
import TabContent from "./components/pages/TabContent";

export default async function Page() {
	const user = await currentUser();
	if (!user) {return <LoginModal open={true}/>}

	const streak: number = await getMetadataProperty(user, 'public', 'streak', 0);
	const total_xp: number = await getMetadataProperty(user, 'public', 'total_xp', 0);
	log(LogType.AUTH, 'Loaded user:', user.firstName, user.lastName, `(${user.username})`);
	log(LogType.AUTH, 'Streak:', streak);
	log(LogType.AUTH, 'Total XP:', total_xp);
	// const streak = 0; const total_xp = 0;
	// const params = await searchParams;
	// const tab = typeof params.tab == 'string' || params.tab == undefined ? (params.tab ?? TABS.find(t => t.default)?.id ?? 'home') : params.tab[0];

	return (
		<div className="not-sm:py-12 sm:pt-16 h-full">
			<TopNavbar streak={streak} total_xp={total_xp}/>
			<TabContent/>
			<BottomNavbar/>
		</div>
	);
}
