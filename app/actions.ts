'use server';
import { clerkClient, currentUser, User } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export enum LogType { AUTH }
const LOG_COLOR = ['purple'];
const LOG_BADGE_STYLE = 'padding:1px 8px;font-weight:bold;border-radius:2px';
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
export async function log(type: LogType, ...data: any[]) {
    console.log(`%c${capitalize(LogType[type])}`, `${LOG_BADGE_STYLE};background:${LOG_COLOR[type]}`, ...data);
}

const ClerkClient = await clerkClient();
const UserAPI = ClerkClient.users;
export async function getMetadataProperty<Type>(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: Type): Promise<Type>
export async function getMetadataProperty(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: undefined): Promise<undefined>
export async function getMetadataProperty<Type>(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: Type|undefined): Promise<Type|undefined> {
    let metadata: 'publicMetadata'|'privateMetadata'|'unsafeMetadata';
    switch (metadata_type) { //? Prevents reading any property if not respecting type
        case 'public': metadata = "publicMetadata"; break;
        case 'private': metadata = "privateMetadata"; break;
        case 'unsafe': metadata = "unsafeMetadata"; break;
        default: metadata = "publicMetadata"; break;
    }
    const userId = typeof user === 'string' ? user : user.id;
    const userObj = typeof user === 'string' ? (await UserAPI.getUser(user)) : user;
    const metadataUpdate = { [metadata_type+'Metadata']: { [property]: default_value } };
    let value = userObj[metadata][property];
    if (value == undefined) {
        if (default_value == undefined) {return undefined}
        return (await UserAPI.updateUserMetadata(userId, metadataUpdate))[metadata][property] as Type;
    }
    return value as Type;
    // return (user[metadata][property] ?? (default_value != undefined ? (await UserAPI.updateUserMetadata(user.id, metadataUpdate))[metadata][property] : undefined)) as Type;
}
export async function setMetadataProperty<Type>(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, value: Type): Promise<Type>
export async function setMetadataProperty<Type>(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, value: Type): Promise<Type> {
    let metadata: 'publicMetadata'|'privateMetadata'|'unsafeMetadata';
    switch (metadata_type) { //? Prevents reading any property if not respecting type
        case 'public': metadata = "publicMetadata"; break;
        case 'private': metadata = "privateMetadata"; break;
        case 'unsafe': metadata = "unsafeMetadata"; break;
        default: metadata = "publicMetadata"; break;
    }
    const userId = typeof user === 'string' ? user : user.id;
    const metadataUpdate = { [metadata_type+'Metadata']: { [property]: value } };
    return (await UserAPI.updateUserMetadata(userId, metadataUpdate))[metadata][property] as Type;
}
export async function incrementMetadataProperty(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: number, increment: number): Promise<number>
export async function incrementMetadataProperty(user: User | string, metadata_type: 'public'|'private'|'unsafe', property: string, default_value: number, increment: number): Promise<number> {
    const prev_value = await getMetadataProperty(user, metadata_type, property, default_value);
    return setMetadataProperty(user, metadata_type, property, prev_value + increment);
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
export async function reloadPage() {
    revalidatePath('/');
}