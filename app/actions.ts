'use server';
import { clerkClient, currentUser, User } from "@clerk/nextjs/server";

export enum LogType { AUTH }
const LOG_COLOR = ['purple'];
const LOG_BADGE_STYLE = 'padding:1px 8px;font-weight:bold;border-radius:2px';
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
export async function log(type: LogType, ...data: any[]) {
    console.log(`%c${capitalize(LogType[type])}`, `${LOG_BADGE_STYLE};background:${LOG_COLOR[type]}`, ...data);
}

const ClerkClient = await clerkClient();
const UserAPI = ClerkClient.users;
export async function getMetadataProperty<Type>(user: User, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: Type): Promise<Type>
export async function getMetadataProperty(user: User, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: undefined): Promise<undefined>
export async function getMetadataProperty<Type>(user: User, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: Type|undefined): Promise<Type|undefined> {
    let metadata: 'publicMetadata'|'privateMetadata'|'unsafeMetadata';
    switch (metadata_type) { //? Prevents reading any property if not respecting type
        case 'public': metadata = "publicMetadata"; break;
        case 'private': metadata = "privateMetadata"; break;
        case 'unsafe': metadata = "unsafeMetadata"; break;
        default: metadata = "publicMetadata"; break;
    }
    const metadataUpdate = { [metadata_type+'Metadata']: { [property]: default_value } };
    let value = user[metadata][property];
    if (value == undefined) {
        if (default_value == undefined) {return undefined}
        return (await UserAPI.updateUserMetadata(user.id, metadataUpdate))[metadata][property] as Type;
    }
    return value as Type;
    // return (user[metadata][property] ?? (default_value != undefined ? (await UserAPI.updateUserMetadata(user.id, metadataUpdate))[metadata][property] : undefined)) as Type;
}

export async function getProfileData(username?: string) {
    const _user = await currentUser();
    if (!_user) {return undefined}
    let user;
    const isSelf = !username || username == _user.username;
    if (!isSelf) {
        const matches = (await UserAPI.getUserList({ username: [username] })).data;
        if (matches.length > 0) {user = matches[0]} //? Since usernames are unique, matches should NEVER have >1 element
    }
    user = user ?? _user;
    const { username: _username, createdAt, imageUrl, fullName } = user;
    const streak: number = await getMetadataProperty(user, 'public', 'streak', 0);
	const total_xp: number = await getMetadataProperty(user, 'public', 'total_xp', 0);
    return { username: _username, createdAt, imageUrl, fullName, streak, total_xp };
}