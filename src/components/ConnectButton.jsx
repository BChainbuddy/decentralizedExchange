"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import Link from "next/link"

export default function ConnectButton() {
    const [metaMask, changeMetamask] = useState(0) // 0 connect to metamask, 1 connected, 2 download metamask
    const [account, setAccount] = useState("") // acount address
    const [isClient, setIsClient] = useState(false)

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

    useEffect(() => {
        setIsClient(true)
    }, [])

    const { connect, connectors } = useConnect()
    const { address } = useAccount()
    const { isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    useEffect(() => {
        if (!isConnected && metaMask === 0) {
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
    }, [isConnected, address])

    // Makes the address cleaner
    const prettyAddress = user => {
        const prettyUser =
            user.substring(0, 8).toString() + "..." + user.substring(user.length - 3).toString()
        setAccount(prettyUser)
    }

    return (
        <>
            {isClient ? (
                <>
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
                            {isActive ? account : "DISCONNECT"}
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
                </>
            ) : (
                <></>
            )}
        </>
    )
}
