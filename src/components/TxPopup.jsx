"use client"

import { useAccount } from "wagmi"
import { useState, useEffect } from "react"

export default function TxPopup({ hash, status }) {
    const { chainId } = useAccount()

    const networkMap = {
        1: "https://etherscan.io/tx/", // Ethereum Mainnet
        11155111: "https://sepolia.etherscan.io/tx/" // Sepolia Testnet,
    }

    const dynamicLink = () => {
        const etherscan = networkMap[chainId]
        return `${etherscan}${hash}`
    }

    useEffect(() => {
        console.log(status)
        console.log(hash)

        const etherscan = networkMap[chainId]
        console.log(etherscan)
        console.log(`${etherscan}${hash}`)
        if (status === "success") {
            console.log("Popup worked!")
        }
        if (status === "error") {
            console.log("Popup error worked!")
        }
    }, [status])

    return (
        <>
            {status === "error" ? (
                <div className="outer">
                    <div className="inner">
                        <p>
                            Error!<span className="ml-1">🚫</span>
                        </p>
                        <a
                            href={dynamicLink()}
                            target="_blank"
                            className="underline cursor-pointer hover:text-gray-400 hover:decoration-gray-400"
                        >
                            View on etherscan
                        </a>
                    </div>
                </div>
            ) : status === "success" ? (
                <div className="outer">
                    <div className="inner">
                        <p>
                            Success!<span className="ml-1">🎉</span>
                        </p>
                        <a
                            href={dynamicLink()}
                            target="_blank"
                            className="underline cursor-pointer hover:text-gray-400 hover:decoration-gray-400"
                        >
                            View on etherscan
                        </a>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    )
}
