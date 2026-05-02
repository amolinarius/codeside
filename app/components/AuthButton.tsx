export default function AuthButton({ type, outline }: { type: 'sign-in'|'sign-up', outline?: boolean }) {
    return type == 'sign-up' ?
        (<div className={"btn btn-primary w-full"+(outline??true ? ' btn-outline' : '')}>Créer un compte</div>) : 
        (<div className={"btn btn-primary w-full"+(outline??false ? ' btn-outline' : '')}>Se connecter</div>);
}