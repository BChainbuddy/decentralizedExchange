import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

export default function Network() {
    const { chain } = useAccount()
    const [clientChain, setClientChain] = useState(null)

    useEffect(() => {
        if (chain) {
            setClientChain(chain)
        }
    }, [chain])

    return (
        <div
            className={`transition duration-500 mr-2 border border-white rounded-md p-3 w-24 flex justify-center items-center overflow-hidden ${
                !clientChain
                    ? "bg-red-500 text-white"
                    : clientChain.name === "Sepolia"
                    ? "bg-cyan-400 text-white"
                    : "bg-red-500 text-white"
            }`}
        >
            <p>
                {!clientChain
                    ? "NETWORK"
                    : clientChain.name === "Sepolia"
                    ? clientChain.name.toUpperCase()
                    : "NETWORK"}
            </p>
        </div>
    )
}
