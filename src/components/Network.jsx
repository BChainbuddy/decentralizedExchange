import { useEffect, useState } from "react"
import { useAccount, useSwitchChain } from "wagmi"

export default function Network() {
    const { chain, isConnected } = useAccount()
    const [clientChain, setClientChain] = useState(null)

    useEffect(() => {
        if (chain) {
            setClientChain(chain)
        }
    }, [chain])

    const { switchChain } = useSwitchChain()

    const handleSwitchChain = () => {
        if (isConnected && chain.name !== "Sepolia") {
            switchChain({ chainId: 11155111 })
        }
    }

    return (
        <div
            className={`transition duration-500 mr-2 border border-white rounded-md w-24 flex justify-center items-center overflow-hidden text-center ${
                !clientChain
                    ? "bg-red-500 text-white cursor-pointer networkText"
                    : clientChain.name === "Sepolia"
                    ? "bg-cyan-400 text-white p-3"
                    : "bg-red-500 text-white cursor-pointer networkText"
            }`}
            onClick={handleSwitchChain}
        >
            <p>
                {!clientChain
                    ? "SWITCH NETWORK"
                    : clientChain.name === "Sepolia" && isConnected
                    ? clientChain.name.toUpperCase()
                    : "SWITCH NETWORK"}
            </p>
        </div>
    )
}
