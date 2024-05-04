import "./globals.css"
import { Montserrat } from "next/font/google"

export const metadata = {
    title: "SEA SWAP",
    description: "Decentralized exchange"
}

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function DexLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${monserrat.className} overflow-x-hidden bg-slate-900`}>
                {children}
            </body>
        </html>
    )
}
