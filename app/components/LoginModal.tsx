import { SignInButton, SignUpButton } from "@clerk/nextjs";
import AuthButton from "./AuthButton";

export default function LoginModal({ open }: { open: boolean }) {
    return (
        <dialog className="modal" open={open}>
            <div className="modal-box relative flex flex-col justify-center items-center not-sm:w-full not-sm:max-w-screen not-sm:h-full pt-10 pb-32">
                <h2 className="text-2xl font-bold mb-4 text-center"><span className="inline-block animate-wave origin-center">👋</span> Bienvenue sur Codeside !</h2>
                <p className="text-center">Pour utiliser l'application, veuillez créer un compte</p>
                <div className="absolute bottom-6 left-6 right-6 text-center">
                    <SignUpButton><AuthButton type="sign-up" outline={false}/></SignUpButton>
                    <div className="mt-2 text-primary">Vous avez déjà un compte ? <span className="*:underline *:font-semibold *:cursor-pointer"><SignInButton>Se connecter</SignInButton></span></div>
                </div>
            </div>
        </dialog>
    )
}