'use client';
import { UserProfile } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <>
            <UserProfile/>
            <Link href="/"><div className="fixed right-2 bottom-2 btn btn-primary rounded-full"><ArrowLeft /> Retour</div></Link>
        </>
    );
}