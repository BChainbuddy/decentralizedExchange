"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ConnectButton from "./ConnectButton"

export function Header() {
    const pathname = usePathname()

    return (
        <header className="justify-between flex flex-row items-center p-6">
            <div className="relative">
                <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
            </div>
            <div className="flex flex-row">
                <Link
                    href={pathname === "/" ? "/pools" : "/"}
                    className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
                >
                    {pathname === "/" ? "LIQUIDITY POOLS" : "EXCHANGE"}
                </Link>
                <ConnectButton />
            </div>
        </header>
    )
}
