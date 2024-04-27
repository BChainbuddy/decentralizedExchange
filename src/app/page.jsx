"use client"

import Image from "next/image"
import { Montserrat } from "next/font/google"
import Input from "../components/input"
import Output from "../components/output"
import Swap from "../components/swap"
import Connect from "../components/connectButton"
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
    const [connected, setConnected] = useState(false)

    // Mainnet
    const [chosenTokenInput, chooseTokenInput] = useState("Symbol")
    const [chosenTokenOutput, chooseTokenOutput] = useState("Symbol")
    const [chosenTokenAddressInput, chooseTokenAddressInput] = useState(0)
    const [chosenTokenAddressOutput, chooseTokenAddressOutput] = useState(0)
    const [chosenTokenDecimalsInput, chooseTokenDecimalsInput] = useState(0)
    const [chosenTokenDecimalsOutput, chooseTokenDecimalsOutput] = useState(0)
    const [amountOutput, changeAmountOutput] = useState(0)
    const [inputAmount, setInputAmount] = useState(0)
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
                <div
                    className={`${
                        isMainnet ? "shadow-cyan-500" : "shadow-yellow-500"
                    } w-[450px] space-y-1 mt-16 py-10 text-gray-400 p-10 text-center flex flex-col rounded-xl shadow-2xl transition duration-200`}
                >
                    <p className="text-2xl mb-4">Exchange Tokens</p>
                    <div className="flex flex-col">
                        <div>
                            <p className="ml-2 text-left">Input</p>
                        </div>
                        {isMainnet ? (
                            <Input
                                chooseTokenInput={chooseTokenInput}
                                chosenTokenInput={chosenTokenInput}
                                chooseTokenAddressInput={chooseTokenAddressInput}
                                chooseTokenDecimalsInput={chooseTokenDecimalsInput}
                                setInputAmount={setInputAmount}
                            ></Input>
                        ) : (
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
                        )}
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
                        {isMainnet ? (
                            <Output
                                chooseTokenOutput={chooseTokenOutput}
                                chosenTokenOutput={chosenTokenOutput}
                                chosenTokenAddressInput={chosenTokenAddressInput}
                                chooseTokenAddressOutput={chooseTokenAddressOutput}
                                chosenTokenAddressOutput={chosenTokenAddressOutput}
                                chosenTokenDecimalsInput={chosenTokenDecimalsInput}
                                chooseTokenDecimalsOutput={chooseTokenDecimalsOutput}
                                chosenTokenDecimalsOutput={chosenTokenDecimalsOutput}
                                changeAmountOutput={changeAmountOutput}
                                inputAmount={inputAmount}
                                amountOutput={amountOutput}
                            ></Output>
                        ) : (
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
                        )}
                    </div>
                    {isMainnet ? (
                        <Swap
                            chosenTokenAddressInput={chosenTokenAddressInput}
                            chosenTokenAddressOutput={chosenTokenAddressOutput}
                            chosenTokenDecimalsInput={chosenTokenDecimalsInput}
                            chosenTokenDecimalsOutput={chosenTokenDecimalsOutput}
                            inputAmount={inputAmount}
                            connected={connected}
                        ></Swap>
                    ) : (
                        <SwapTest
                            chosenTokenAddressInputTest={chosenTokenAddressInputTest}
                            chosenTokenAddressOutputTest={chosenTokenAddressOutputTest}
                            chosenTokenDecimalsOutputTest={chosenTokenDecimalsOutputTest}
                            chosenTokenDecimalsInputTest={chosenTokenDecimalsInputTest}
                            inputAmountTest={inputAmountTest}
                            outputAmountTest={outputAmountTest}
                        ></SwapTest>
                    )}
                </div>
            </main>
        </div>
    )
}
