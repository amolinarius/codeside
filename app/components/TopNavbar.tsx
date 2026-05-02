'use client';
import { Flame, Zap } from "lucide-react";
import Image from "next/image";
import BottomNavbarContent from "./BottomNavbarContent";

type TopNavbarProps = { streak: number, total_xp: number };

export default function TopNavbar({ streak, total_xp }: TopNavbarProps) {
    const StatsComponent = () => (<>
        <span className="inline-flex gap-1">
            <Flame className="fill-white stroke-orange-400 stroke-3 inline"/>
            <span className="text-orange-400 text-stroke-white text-stroke-4 font-bold">{streak}</span>
        </span>
        <span className="inline-flex gap-1">
            <Zap className="fill-white stroke-purple-500 stroke-3 inline"/>
            <span className="text-purple-500 text-stroke-white text-stroke-4 font-bold">{total_xp}</span>
        </span>
    </>);
    return (
        <nav className="navbar bg-base-300 not-sm:h-12 min-h-12 fixed top-0 left-0 right-0">
            <div className="navbar-start">
                <Image src="/logo.png" alt="Logo" width={48} height={48} className="not-sm:hidden" loading="eager"/>
            </div>

            {/* Mobile layout */}
            <div className="navbar-center justify-between shrink-0 w-1/2 sm:hidden">
                <StatsComponent/>
            </div>
            {/* Dekstop layout */}
            <div className="navbar-center justify-between gap-10 not-sm:hidden">
                <BottomNavbarContent/>
            </div>
            <div className="navbar-end">
                <div className="not-sm:hidden flex gap-5 pr-5"><StatsComponent /></div>
            </div>
        </nav>
    );
}