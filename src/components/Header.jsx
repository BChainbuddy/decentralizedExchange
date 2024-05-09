"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ConnectButton from "./ConnectButton"
import Network from "./Network"

export function Header() {
    const pathname = usePathname()

    return (
        <header className="justify-between flex flex-row items-center py-6 pl-6 pr-0">
            <div className="relative">
                <Link href="/">
                    <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
                </Link>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
            </div>
            <div className="flex flex-row">
                <Link
                    href={pathname === "/dex" ? "/pools" : "/dex"}
                    className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300 text-center"
                >
                    {pathname === "/dex" ? "LIQUIDITY POOLS" : "EXCHANGE"}
                </Link>
                <Network />
                <ConnectButton />
            </div>
        </header>
    )
}
