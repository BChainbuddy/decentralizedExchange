import "./../globals.css"
import Providers from "./../providers"
import { Header } from "@/components/Header"

export const metadata = {
    title: "SEA SWAP",
    description: "Decentralized exchange"
}

export default function PoolsLayout({ children }) {
    return (
        <html lang="en">
            <body className={`bg-slate-900 p-16`}>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
