//? Edited versions of Lucide's icons
type IconType = 'house'|'circle-ellipsis';
export default function Icon({ type }: { type: IconType }) {
    switch (type) {
        case 'house': return (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--color-amber-300)" stroke="var(--color-amber-600)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" stroke="var(--color-amber-600)"/>
            </svg>
        );
    }
}
