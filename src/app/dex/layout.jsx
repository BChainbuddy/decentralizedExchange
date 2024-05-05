import "./../globals.css"
import { Header } from "@/components/Header"

export const metadata = {
    title: "SEA SWAP",
    description: "Decentralized exchange"
}

export default function DexLayout({ children }) {
    return (
        <div className={`bg-slate-900 p-16 flex flex-col`}>
            <Header />
            {children}
        </div>
    )
}
