'use client';
import BottomNavbarContent from "./BottomNavbarContent";

export default function BottomNavbar() {
    return (
        <nav className="bg-base-300 h-12 min-h-12 sm:hidden fixed bottom-0 left-0 right-0 flex justify-evenly items-center">
            <BottomNavbarContent/>
        </nav>
    );
}