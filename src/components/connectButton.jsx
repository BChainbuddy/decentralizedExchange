"use client" // This is a client components

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import Link from "next/link"

export default function ConnectButton() {
    const [metaMask, changeMetamask] = useState(0) // 0 connect to metamask, 1 connected, 2 download metamask
    const [account, setAccount] = useState("") // acount address

    // State variable for toggle
    const [isActive, setActive] = useState(true)

    // Toggle disconnect and address
    const toggleWords = () => {
        if (isActive) {
            setActive(false)
        } else {
            setActive(true)
        }
    }

    const { connect, connectors } = useConnect()
    const { address } = useAccount()
    const { isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    useEffect(() => {
        if (!isConnected) {
            // If metamask can't be found
            if (typeof window.ethereum === "undefined") {
                changeMetamask(2)
            } else {
                // If the user is not connected
                changeMetamask(0)
                setActive(true)
            }
        } else {
            // If user is already connected
            changeMetamask(1)
            prettyAddress(address)
        }
    }, [isConnected])

    // Makes the address cleaner
    const prettyAddress = user => {
        const prettyUser =
            user.substring(0, 8).toString() + "..." + user.substring(user.length - 3).toString()
        setAccount(prettyUser)
    }

    return (
        <section>
            {metaMask === 0 ? (
                <>
                    {connectors.map(connector => (
                        <button
                            key={connector.id}
                            onClick={() => {
                                connect({ connector })
                                changeMetamask(1)
                            }}
                            className={`button text-gray-400 mr-10 border border-white rounded-md p-3 hover:bg-zinc-300`}
                        >
                            CONNECT WALLET
                        </button>
                    ))}
                </>
            ) : metaMask === 1 ? (
                <button
                    className={`button text-gray-400 mr-10 border border-white rounded-md p-3 hover:bg-zinc-300 w-40`}
                    onClick={disconnect}
                    id="disconnectButton"
                    onMouseEnter={toggleWords}
                    onMouseLeave={toggleWords}
                >
                    <span className={isActive ? "" : "hidden"}>{account}</span>
                    <span className={isActive ? "hidden" : ""}>DISCONNECT</span>
                </button>
            ) : (
                <Link href="https://metamask.io/download/" target="_blank">
                    <button
                        className={`button text-gray-400 mr-10 border border-white rounded-md p-3 hover:bg-zinc-300`}
                    >
                        Download Metamask
                    </button>
                </Link>
            )}
        </section>
    )
}
