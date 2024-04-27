"use client"

import Image from "next/image"
import { Montserrat } from "next/font/google"
import Input from "../components/input"
import Output from "../components/output"
import Swap from "../components/swap"
import Connect from "../components/ConnectButton"
import { useState } from "react"
import Link from "next/link"
import InputTestnet from "@/components/inputTestnet"
import OutputTestnet from "@/components/outputTestnet"
import SwapTest from "@/components/swapTest"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function Home() {
    const [isMainnet, setIsMainnet] = useState(false) // to switch between mainnet and testnet tokens

    // Testnet tokens(liquidityPool)
    const [chosenTokenInputTest, chooseTokenInputTest] = useState("Symbol")
    const [chosenTokenOutputTest, chooseTokenOutputTest] = useState("Symbol")
    const [chosenTokenAddressInputTest, chooseTokenAddressInputTest] = useState(0)
    const [chosenTokenAddressOutputTest, chooseTokenAddressOutputTest] = useState(0)
    const [chosenTokenDecimalsInputTest, chooseTokenDecimalsInputTest] = useState(0)
    const [chosenTokenDecimalsOutputTest, chooseTokenDecimalsOutputTest] = useState(0)
    const [inputAmountTest, setInputAmountTest] = useState(0)
    const [outputAmountTest, setOutputAmountTest] = useState(0)

    return (
        <div className={monserrat.className}>
            <main className="flex justify-center">
                <div className="shadow-cyan-500 w-[450px] space-y-1 mt-16 py-10 text-gray-400 p-10 text-center flex flex-col rounded-xl shadow-2xl transition duration-200">
                    <p className="text-2xl mb-4">Exchange Tokens</p>
                    <div className="flex flex-col">
                        <div>
                            <p className="ml-2 text-left">Input</p>
                        </div>
                        <InputTestnet
                            chosenTokenInputTest={chosenTokenInputTest}
                            chooseTokenInputTest={chooseTokenInputTest}
                            chosenTokenAddressInputTest={chosenTokenAddressInputTest}
                            chooseTokenAddressInputTest={chooseTokenAddressInputTest}
                            chooseTokenDecimalsInputTest={chooseTokenDecimalsInputTest}
                            chosenTokenDecimalsInputTest={chosenTokenDecimalsInputTest}
                            setInputAmountTest={setInputAmountTest}
                            isMainnet={isMainnet}
                        />
                    </div>
                    <div className="flex justify-center">
                        <Image
                            src="/arrowDownLong.svg"
                            alt="arrow"
                            width={50}
                            height={50}
                            className="mt-3"
                        ></Image>
                    </div>
                    <div>
                        <div>
                            <p className="ml-2 text-left">Output</p>
                        </div>
                        <OutputTestnet
                            chosenTokenOutputTest={chosenTokenOutputTest}
                            chooseTokenOutputTest={chooseTokenOutputTest}
                            chosenTokenAddressOutputTest={chosenTokenAddressOutputTest}
                            chooseTokenAddressOutputTest={chooseTokenAddressOutputTest}
                            chooseTokenDecimalsOutputTest={chooseTokenDecimalsOutputTest}
                            chosenTokenDecimalsOutputTest={chosenTokenDecimalsOutputTest}
                            inputAmountTest={inputAmountTest}
                            setOutputAmountTest={setOutputAmountTest}
                            chosenTokenAddressInputTest={chosenTokenAddressInputTest}
                            outputAmountTest={outputAmountTest}
                        />
                    </div>
                    <SwapTest
                        chosenTokenAddressInputTest={chosenTokenAddressInputTest}
                        chosenTokenAddressOutputTest={chosenTokenAddressOutputTest}
                        chosenTokenDecimalsOutputTest={chosenTokenDecimalsOutputTest}
                        chosenTokenDecimalsInputTest={chosenTokenDecimalsInputTest}
                        inputAmountTest={inputAmountTest}
                        outputAmountTest={outputAmountTest}
                    ></SwapTest>
                </div>
            </main>
        </div>
    )
}
