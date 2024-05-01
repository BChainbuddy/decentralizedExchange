"use client"

import { Montserrat } from "next/font/google"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import POOLTRACKER_ABI from "../../../constants/PoolTrackerAbi.json"
import POOLTRACKER_ADDRESS from "../../../constants/PoolTrackerAddress.json"
import ERC20ABI from "../../../constants/ERC20abi.json"
import { useState, useEffect } from "react"
import Moralis from "moralis"
import TokenInput from "@/components/TokenInput"
import { ethers } from "ethers"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function DeployPool() {
    const [chosenToken1, setChosenToken1] = useState({ symbol: "Symbol" })
    const [chosenToken2, setChosenToken2] = useState({ symbol: "Symbol" })
    const [amountToken1, setAmountToken1] = useState(0)
    const [amountToken2, setAmountToken2] = useState(0)

    const [tokenList, setTokenList] = useState([])

    const { address, isConnected, chainId } = useAccount()

    const { writeContract: deployPool } = useWriteContract()

    const { data: exists } = useReadContract({
        address: POOLTRACKER_ADDRESS["11155111"],
        abi: POOLTRACKER_ABI,
        functionName: "exists",
        args: [chosenToken1.address, chosenToken2.address]
    })

    const getUserTokens = async () => {
        await Moralis.start({
            apiKey: process.env.NEXT_PUBLIC_MORALIS
        })

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
    }

    const { data: allowanceToken1 } = useReadContract({
        abi: ERC20ABI,
        address: chosenToken1.address,
        functionName: "allowance",
        args: [address, POOLTRACKER_ADDRESS["11155111"]]
    })

    const { data: allowanceToken2 } = useReadContract({
        abi: ERC20ABI,
        address: chosenToken2.address,
        functionName: "allowance",
        args: [address, POOLTRACKER_ADDRESS["11155111"]]
    })

    const {
        status: approveToken1Status,
        writeContract: approveToken1,
        isPending: pendingApproval1,
        error: inputError1
    } = useWriteContract()

    const {
        status: approveToken2Status,
        writeContract: approveToken2,
        isPending: pendingApproval2,
        error: inputError2
    } = useWriteContract()

    const handleClick = () => {
        console.log(allowanceToken1)
        console.log(allowanceToken2)
        console.log(amountToken1)
        console.log(amountToken2)
        if (
            Number(allowanceToken1) / 10 ** 18 < amountToken1 ||
            Number(allowanceToken2) / 10 ** 18 < amountToken2
        ) {
            console.log("Approving...")
            approveToken()
            return
        }
        handleDeploy()
    }

    const approveToken = () => {
        try {
            if (Number(allowanceToken1) / 10 ** 18 < amountToken1) {
                approveToken1({
                    abi: ERC20ABI,
                    address: chosenToken1.address,
                    functionName: "approve",
                    args: [
                        POOLTRACKER_ADDRESS["11155111"],
                        ethers.parseEther((amountToken1 * 2).toString())
                    ]
                })
            }
            if (Number(allowanceToken2) / 10 ** 18 < amountToken2) {
                approveToken2({
                    abi: ERC20ABI,
                    address: chosenToken2.address,
                    functionName: "approve",
                    args: [
                        POOLTRACKER_ADDRESS["11155111"],
                        ethers.parseEther((amountToken2 * 2).toString())
                    ]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeploy = () => {
        try {
            deployPool({
                address: POOLTRACKER_ADDRESS["11155111"],
                abi: POOLTRACKER_ABI,
                functionName: "createPool",
                args: [
                    chosenToken1.address,
                    chosenToken2.address,
                    ethers.parseEther(amountToken1.toString()),
                    ethers.parseEther(amountToken2.toString())
                ]
            })
        } catch (error) {
            console.log(error)
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
                    <div className="flex flex-row items-center mt-6">
                        <div
                            className={`rounded-full h-4 w-4 transition duration-300 ${
                                !chosenToken1.address || !chosenToken2.address
                                    ? "bg-white"
                                    : exists
                                    ? "bg-red-500"
                                    : "bg-green-500"
                            }`}
                        ></div>
                        <p
                            className={`ml-1 transition duration-300 ${
                                !chosenToken1.address || !chosenToken2.address
                                    ? "text-white"
                                    : exists
                                    ? "text-red-500"
                                    : "text-green-500"
                            }`}
                        >
                            Is available
                        </p>
                    </div>
                    <button
                        className={`py-1 px-6 rounded-2xl text-black mt-6 text-lg transition-all duration-500 ease-out ${
                            exists || !chosenToken1.address || !chosenToken2.address
                                ? "bg-cyan-800"
                                : "bg-cyan-500 hover:scale-105"
                        }`}
                        disabled={exists || !chosenToken1.address || !chosenToken2.address}
                        onClick={handleClick}
                    >
                        {Number(allowanceToken1) / 10 ** 18 >= amountToken1 &&
                        Number(allowanceToken2) / 10 ** 18 >= amountToken2
                            ? "DEPLOY"
                            : "APPROVE"}
                    </button>
                </>
            ) : (
                <div className="mt-20">
                    <p className="text-xl text-cyan-500">Connect wallet</p>
                </div>
            )}
        </div>
    )
}
