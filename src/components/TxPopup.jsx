"use client"

import { useAccount } from "wagmi"

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
