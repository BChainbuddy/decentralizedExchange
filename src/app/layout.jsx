import "./globals.css"
import { Montserrat } from "next/font/google"
import Providers from "./providers"

export const metadata = {
    title: "SEA SWAP",
    description: "Decentralized exchange"
}

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function Layout({ children }) {
    return (
        <html lang="en">
            <body className={`${monserrat.className} overflow-x-hidden bg-slate-900`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
