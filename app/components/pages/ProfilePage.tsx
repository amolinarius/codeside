import { getProfileData } from "@/app/actions";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage({ username: _username }: { username?: string }) {
    const [user, setUser] = useState<Awaited<ReturnType<typeof getProfileData>>|undefined>();
    useEffect(() => {
        getProfileData(_username).then(data => setUser(data))
    }, []);
    if (user == undefined) {return <div className="flex justify-center items-center">Chargement...</div>}
    const formatJoinDate = (d: Date) => `${['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'][d.getMonth()]} ${d.getFullYear()}`
    const joinDate = new Date(user.createdAt);

    return (
        <div className="flex justify-center">
            <div className="flex flex-row not-sm:scale-85 justify-center items-center h-fit origin-top">
                <Image src={user.imageUrl} alt="Profile picture" width={64} height={64} className="rounded-full w-16 h-16" />
                <div className="ml-5 h-fit">
                    <div className="font-bold text-lg">{user.fullName}</div>
                    <div className="text-gray-500"><span className="font-dosis">@</span>{user.username}・Depuis {formatJoinDate(joinDate)}</div>
                </div>
            </div>
        </div>
    )
}