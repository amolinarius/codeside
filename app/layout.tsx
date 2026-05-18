import type { Metadata } from "next";
import { Dosis, Nunito } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import TabContextProvider from "./components/TabContext";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const dosis = Dosis({ variable: "--font-dosis", style: "normal", subsets: ["latin"]})
export const metadata: Metadata = {
	title: "Codeside",
	description: "A Progressive Web App to learn Python",
	icons: {
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png"
	}
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${nunito.className} ${dosis.variable} h-screen antialiased`}>
			<body className="h-full bg-base-100">
				<ClerkProvider localization={frFR}>
					<TabContextProvider>
						{children}
					</TabContextProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
