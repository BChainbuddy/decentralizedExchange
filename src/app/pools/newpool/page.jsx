"use client"

import { Montserrat } from "next/font/google"
import { useAccount } from "wagmi"
import { useState, useEffect } from "react"
import Moralis from "moralis"
import TokenInput from "@/components/TokenInput"
import DeployPool from "@/components/DeployPool"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function NewPool() {
    const [chosenToken1, setChosenToken1] = useState({ symbol: "Symbol" })
    const [chosenToken2, setChosenToken2] = useState({ symbol: "Symbol" })
    const [amountToken1, setAmountToken1] = useState(0)
    const [amountToken2, setAmountToken2] = useState(0)

    const [tokenList, setTokenList] = useState([])

    const { address, isConnected, chainId } = useAccount()

    const getUserTokens = async () => {
        try {
            if (!Moralis.Core.isStarted) {
                await Moralis.start({
                    apiKey: process.env.NEXT_PUBLIC_MORALIS
                })
            }

            const chain = `0x${chainId.toString(16)}`

            const response = await Moralis.EvmApi.token.getWalletTokenBalances({
                chain,
                address
            })
            const result = response.toJSON()
            let list = result.map(token => {
                return {
                    address: token.token_address,
                    symbol: token.symbol
                }
            })
            list = list.filter(token => {
                return token.symbol
            })
            if (list) {
                setTokenList(list)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (isConnected) {
            getUserTokens()
        }
    }, [isConnected])

    return (
        <div
            className={`${monserrat.className} flex flex-col items-center justify-center text-gray-400 `}
        >
            <p className="text-2xl mt-12 border-b px-3 pb-1">DEPLOY A NEW POOL</p>
            <div className="w-[500px] mt-3">
                <p className="text-sm">
                    To deploy a new pool you need to input two tokens of your choice that can then
                    be traded. The liquidity pool must not exist till date. Notice: liquidity gets
                    locked for 1 year to protect investors, meaning the initial deployer can't
                    retrieve it!
                </p>
            </div>
            {isConnected ? (
                <>
                    <div className="mt-16">
                        <p>Token 1</p>
                        <TokenInput
                            tokenList={tokenList}
                            setInputAmount={setAmountToken1}
                            chosenTokenInput={chosenToken1}
                            setChosenTokenInput={setChosenToken1}
                        />
                        <div className="text-3xl text-center mt-1.5">+</div>
                        <p>Token 2</p>
                        <TokenInput
                            tokenList={tokenList}
                            setInputAmount={setAmountToken2}
                            chosenTokenInput={chosenToken2}
                            setChosenTokenInput={setChosenToken2}
                        />
                    </div>
                    <DeployPool
                        amountToken1={amountToken1}
                        amountToken2={amountToken2}
                        chosenToken1={chosenToken1}
                        chosenToken2={chosenToken2}
                    />
                </>
            ) : (
                <div className="mt-20">
                    <p className="text-xl text-cyan-500">Connect wallet</p>
                </div>
            )}
        </div>
    )
}
