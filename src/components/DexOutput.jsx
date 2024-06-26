"use client"

import TokenList from "./TokenList"
import SWAPROUTER_ADDRESS from "../constants/DexAddress.json"
import SWAPROUTER_ABI from "../constants/DexAbi.json"
import { useState } from "react"
import { useReadContract } from "wagmi"
import { ethers } from "ethers"
import { shortenSymbol } from "@/utils/shortenSymbol"

export default function DexOutput({
    tokenList,
    chosenTokenInput,
    inputAmount,
    chosenTokenOutput,
    setChosenTokenOutput
}) {
    const [modal, showModal] = useState(false)

    const openModal = () => {
        showModal(true)
    }

    const { data: swapAmount } = useReadContract({
        abi: SWAPROUTER_ABI,
        address: SWAPROUTER_ADDRESS["11155111"],
        functionName: "getSwapAmount",
        args: [
            chosenTokenInput.address,
            chosenTokenOutput.address,
            ethers.parseEther(inputAmount.toString())
        ]
    })

    function willChooseToken(symbol, address) {
        console.log(`This is the chosen token symbol ${symbol}`)
        console.log(`This is the chosen token address ${address}`)
        setChosenTokenOutput({ address: address, symbol: symbol })
    }

    return (
        <div>
            <div className="flex flex-row p-1">
                <input
                    className={`bg-slate-300 rounded-l-md border-2 p-2 ${
                        inputAmount ? "placeholder:text-gray-600" : ""
                    }`}
                    type="number"
                    id="Amount"
                    name="Amount"
                    step="0.1"
                    min="0"
                    placeholder={swapAmount && inputAmount ? Number(swapAmount) / 10 ** 18 : "0"}
                    disabled
                ></input>
                <button
                    className="transition-all ease-in-out duration-300 border-2 rounded-r-md px-3 hover:bg-zinc-300 hover:text-gray-600 w-[105px]"
                    onClick={openModal}
                >
                    {chosenTokenOutput.symbol.length > 6
                        ? shortenSymbol(chosenTokenOutput.symbol, 5)
                        : chosenTokenOutput.symbol}
                </button>
            </div>
            {modal ? (
                <TokenList
                    tokenList={tokenList}
                    willChooseToken={willChooseToken}
                    showModal={showModal}
                />
            ) : (
                <></>
            )}
        </div>
    )
}
