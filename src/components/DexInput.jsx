"use client"

import { useState } from "react"
import TokenList from "./TokenList"

export default function DexInput({
    tokenList,
    chosenTokenInput,
    setChosenTokenInput,
    setInputAmount,
    inputAmount
}) {
    const [modal, showModal] = useState(false)

    function shortenSymbol(longSymbol) {
        const newSymbol = longSymbol.substring(0, 5).toString() + ".."
        return newSymbol
    }

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
                    placeholder="100"
                    min="0"
                    value={inputAmount}
                    onChange={e => setInputAmount(e.target.value)}
                ></input>
                <button
                    className="transition ease-in-out duration-250 border-2 rounded-r-md px-3 hover:bg-zinc-300 hover:text-gray-600"
                    onClick={openModal}
                >
                    {chosenTokenInput.symbol.length > 6
                        ? shortenSymbol(chosenTokenInput.symbol)
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