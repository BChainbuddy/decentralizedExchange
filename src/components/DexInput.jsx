"use client"

import { useState } from "react"
import TokenList from "./TokenList"
import { shortenSymbol } from "@/utils/shortenSymbol"

export default function DexInput({
    tokenList,
    chosenTokenInput,
    setChosenTokenInput,
    setInputAmount
}) {
    const [modal, showModal] = useState(false)

    const openModal = () => {
        showModal(true)
    }

    function willChooseToken(symbol, address) {
        console.log(`This is the chosen token symbol ${symbol}`)
        console.log(`This is the chosen token address ${address}`)
        setChosenTokenInput({ address: address, symbol: symbol })
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
                    placeholder="0"
                    min="0"
                    onChange={e => {
                        if (e.target.value > 0) {
                            setInputAmount(e.target.value)
                        } else {
                            setInputAmount(0)
                        }
                    }}
                ></input>
                <button
                    className="transition-all ease-in-out duration-300 border-2 rounded-r-md px-3 hover:bg-zinc-300 hover:text-gray-600 w-[105px]"
                    onClick={openModal}
                >
                    {chosenTokenInput.symbol.length > 6
                        ? shortenSymbol(chosenTokenInput.symbol, 5)
                        : chosenTokenInput.symbol}
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
