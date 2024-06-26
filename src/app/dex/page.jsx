"use client"

import Image from "next/image"
import { Montserrat } from "next/font/google"
import { useEffect, useState } from "react"
import { useReadContract, useReadContracts } from "wagmi"
import POOLTRACKER_ABI from "../../constants/PoolTrackerAbi.json"
import POOLTRACKER_ADDRESS from "../../constants/PoolTrackerAddress.json"
import ERC20ABI from "../../constants/ERC20Abi.json"
import DexInput from "@/components/DexInput"
import DexOutput from "@/components/DexOutput"
import DexSwap from "@/components/DexSwap"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function Dex() {
    const [chosenTokenInput, setChosenTokenInput] = useState({ symbol: "Symbol" })
    const [chosenTokenOutput, setChosenTokenOutput] = useState({ symbol: "Symbol" })
    const [inputAmount, setInputAmount] = useState(0)
    const [tokenList, setTokenList] = useState([])

    const { data: tokenAddresses } = useReadContract({
        abi: POOLTRACKER_ABI,
        address: POOLTRACKER_ADDRESS["11155111"].toString(),
        functionName: "tokenList"
    })

    const { data: tokenSymbols } = useReadContracts({
        contracts: tokenAddresses?.map(address => ({
            address: address,
            functionName: "symbol",
            abi: ERC20ABI
        })),
        watch: true
    })

    const getTokenList = () => {
        return tokenAddresses.map((address, index) => ({
            address: address,
            symbol: tokenSymbols[index].result
        }))
    }

    useEffect(() => {
        if (tokenSymbols) {
            setTokenList(getTokenList())
        }
    }, [tokenSymbols])

    return (
        <main className={`${monserrat.className} flex-1 flex justify-center items-center`}>
            <div className="shadow-cyan-500 w-[450px] space-y-1 mt-16 py-10 text-gray-400 p-10 text-center flex flex-col rounded-xl shadow-2xl transition duration-200 mb-8">
                <p className="text-2xl mb-4 text-white textShadow">TOKEN EXCHANGE</p>
                <div className="flex flex-col">
                    <p className="ml-2 text-left">Input</p>
                    <DexInput
                        chosenTokenInput={chosenTokenInput}
                        setChosenTokenInput={setChosenTokenInput}
                        tokenList={tokenList}
                        setInputAmount={setInputAmount}
                        inputAmount={inputAmount}
                    />
                </div>
                <div className="flex justify-center">
                    <Image
                        src="/arrowDownLong.svg"
                        alt="arrow"
                        width={40}
                        height={40}
                        className="mt-3"
                    ></Image>
                </div>
                <div>
                    <p className="ml-2 text-left">Output</p>
                    <DexOutput
                        chosenTokenInput={chosenTokenInput}
                        tokenList={tokenList}
                        inputAmount={inputAmount}
                        chosenTokenOutput={chosenTokenOutput}
                        setChosenTokenOutput={setChosenTokenOutput}
                    />
                </div>
                <DexSwap
                    chosenTokenInput={chosenTokenInput}
                    chosenTokenOutput={chosenTokenOutput}
                    inputAmount={inputAmount}
                />
            </div>
        </main>
    )
}
