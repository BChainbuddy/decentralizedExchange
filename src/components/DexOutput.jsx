"use client"

import TokenList from "./TokenList"
import SWAPROUTER_ADDRESS from "../constants/DexAddress.json"
import SWAPROUTER_ABI from "../constants/DexAbi.json"
import { useEffect, useState } from "react"
import { useReadContract } from "wagmi"

export default function DexOutput({
    tokenList,
    chosenTokenInput,
    inputAmount,
    chosenTokenOutput,
    setChosenTokenOutput
}) {
    const [modal, showModal] = useState(false)

    function shortenSymbol(longSymbol) {
        const newSymbol = longSymbol.substring(0, 5).toString() + ".."
        return newSymbol
    }

    const openModal = () => {
        showModal(true)
    }

    const { data: swapAmount } = useReadContract({
        abi: SWAPROUTER_ABI,
        address: SWAPROUTER_ADDRESS["11155111"].toString(),
        functionName: "getSwapAmount",
        args: [chosenTokenInput.address, chosenTokenOutput.address, inputAmount]
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
                    className="bg-slate-300 rounded-l-md border-2 p-2 text-gray-600"
                    type="number"
                    id="Amount"
                    name="Amount"
                    step="0.1"
                    min="0"
                    placeholder={swapAmount}
                    disabled
                ></input>
                <button
                    className="transition ease-in-out duration-250 border-2 rounded-r-md px-3 hover:bg-zinc-300 hover:text-gray-600"
                    onClick={openModal}
                >
                    {chosenTokenOutput.symbol.length > 6
                        ? shortenSymbol(chosenTokenOutput.symbol)
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
