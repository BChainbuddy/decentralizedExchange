"use client"

import { useState } from "react"
import { useAccount, useReadContract } from "wagmi"
import ClaimRewards from "./ClaimRewards"
import RemoveLiquidity from "./RemoveLiquidity"
import AddLiquidity from "./AddLiquidity"
import ABI from "../constants/LiquidityPoolAbi.json"

export default function UserContributions({
    symbolOne,
    symbolTwo,
    addressOne,
    addressTwo,
    poolAddress
}) {
    // Modals display
    const [displayModal, setDisplayModal] = useState(false)
    const [displayModal2, setDisplayModal2] = useState(false)
    const [displayModal3, setDisplayModal3] = useState(false)

    const { address, isConnected } = useAccount()

    const { data: userLpTokens } = useReadContract({
        abi: ABI,
        address: poolAddress,
        functionName: "getLpTokenQuantity",
        args: [address]
    })

    const { data: userYieldDistributed } = useReadContract({
        abi: ABI,
        address: poolAddress,
        functionName: "yieldTaken",
        args: [address]
    })

    return (
        <>
            <section className="mx-auto flex flex-col text-white/75 place-items-center mt-24 space-y-12  w-5/12 py-8 px-2 rounded-xl pb-10 userContributions">
                <p className="text-center text-2xl text-white">YOUR CONTRIBUTIONS:</p>
                {isConnected ? (
                    <>
                        <div className="flex flex-row items-center w-full">
                            <div className="w-1/2 text-center">
                                <p className="text-lg">LIQUIDITY PROVIDED</p>
                                <p
                                    className={`${
                                        symbolTwo === "Loading..." ? "hidden" : ""
                                    } text-base`}
                                >
                                    {userLpTokens
                                        ? Math.floor(Number(userLpTokens)) / 10 ** 36
                                        : "0"}
                                </p>
                            </div>
                            <div className="flex justify-center w-1/2">
                                <div className="flex flex-col space-y-3">
                                    <button
                                        onClick={() => {
                                            setDisplayModal(true)
                                        }}
                                        className="block transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-105 hover:bg-cyan-700 w-44"
                                    >
                                        Add liquidity
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDisplayModal2(true)
                                        }}
                                        className="block transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-105 hover:bg-cyan-700 w-44"
                                    >
                                        Remove liquidity
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row items-center w-full">
                            <div className="w-1/2 text-center">
                                <p className="text-lg">YIELD EARNED</p>
                                <p
                                    className={`${
                                        symbolTwo === "Loading..." ? "hidden" : ""
                                    } text-base`}
                                >
                                    {userYieldDistributed
                                        ? Number(userYieldDistributed) / 10 ** 18
                                        : "0"}
                                </p>
                            </div>
                            <div className="flex justify-center w-1/2">
                                <button
                                    onClick={() => {
                                        setDisplayModal3(true)
                                    }}
                                    className="transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-105 hover:bg-cyan-700 w-44"
                                >
                                    Get yield
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        <p className="text-xl text-cyan-500">Connect to wallet</p>
                    </div>
                )}
            </section>
            <AddLiquidity
                closeModal={setDisplayModal}
                displayModal={displayModal}
                symbolOne={symbolOne}
                symbolTwo={symbolTwo}
                addressOne={addressOne}
                addressTwo={addressTwo}
                poolAddress={poolAddress}
            />
            <RemoveLiquidity
                closeModal={setDisplayModal2}
                displayModal={displayModal2}
                poolAddress={poolAddress}
            />
            <ClaimRewards
                closeModal={setDisplayModal3}
                displayModal={displayModal3}
                poolAddress={poolAddress}
            />
        </>
    )
}
