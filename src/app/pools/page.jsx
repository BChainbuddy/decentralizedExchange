"use client"

import { Montserrat } from "next/font/google"
import { useAccount, useReadContract, useReadContracts } from "wagmi"
import POOLTRACKER_ABI from "../../constants/PoolTrackerAbi.json"
import POOLTRACKER_ADDRESS from "../../constants/PoolTrackerAddress.json"
import PoolList from "@/components/PoolList"
import ABI from "../../constants/LiquidityPoolAbi.json"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function LiquidityPools() {
    const { address, isConnected } = useAccount()

    const [userPoolsFilter, setUserPoolsFilter] = useState("")
    const [allPoolsFilter, setAllPoolsFilter] = useState("")

    const [userPools, setUserPools] = useState("")

    const { data: poolList } = useReadContract({
        abi: POOLTRACKER_ABI,
        address: POOLTRACKER_ADDRESS["11155111"].toString(),
        functionName: "getPools"
    })

    const { data: userContributions } = useReadContracts({
        contracts: poolList?.map(poolAddress => ({
            address: poolAddress,
            functionName: "getLpTokenQuantity",
            abi: ABI,
            args: [address]
        })),
        watch: true
    })

    const contributedPools = () => {
        if (userContributions) {
            let userList = poolList.map((pool, i) => {
                if (Number(userContributions[i].result) > 0) {
                    return pool
                }
            })

            userList = userList.filter(pool => {
                return pool !== undefined
            })

            if (userList.length > 0) {
                return userList
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    }

    const router = useRouter()

    useEffect(() => {
        if (userContributions) {
            setUserPools(contributedPools())
        }
    }, [userContributions])

    return (
        <main className={`mt-10 ${monserrat.className} pb-16`}>
            <div className="flex flex-col place-items-center">
                <h1 className="text-white textShadow text-2xl border-b pb-1 w-64 text-center">
                    CONTRIBUTED TO
                </h1>
                <input
                    id="userPools"
                    type="text"
                    placeholder="Search symbol..."
                    className="bg-transparent mt-2 outline-none focus:border focus:border-cyan-500 p-1 text-white w-36 border border-transparent border-b-white transition-colors duration-100"
                    onChange={e => {
                        setUserPoolsFilter(e.target.value)
                    }}
                />
                {isConnected ? (
                    <>
                        {userPools ? (
                            <PoolList poolList={userPools} text={userPoolsFilter} />
                        ) : (
                            <div className="flex justify-center max-h-64 items-center pt-5 mt-5 pb-6 animate-pulse">
                                <p className="text-xl text-cyan-500">Loading</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex justify-center max-h-64 items-center pt-5 mt-5 pb-6">
                        <p className="text-xl text-cyan-500 ">Connect Wallet</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col place-items-center mt-8">
                <h1 className="text-white textShadow text-2xl border-b pb-1 w-80 text-center">
                    TOP LIQUIDITY POOLS
                </h1>
                <input
                    id="allPools"
                    type="text"
                    placeholder={"Search symbol.."}
                    className="bg-transparent mt-2 outline-none focus:border focus:border-cyan-500 p-1 text-white w-36 border border-transparent border-b-white transition-colors duration-100"
                    onChange={e => {
                        setAllPoolsFilter(e.target.value)
                    }}
                    value={allPoolsFilter}
                />
                {poolList ? (
                    <PoolList poolList={poolList} text={allPoolsFilter} />
                ) : (
                    <div className="flex justify-center max-h-64 items-center pt-5 mt-5 pb-6 animate-pulse">
                        <p className="text-xl text-cyan-500">Loading pools...</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col place-items-center space-y-3 mt-12">
                <h1 className="text-gray-400 text-lg">Want to start a liquidity pool?</h1>
                <button
                    className="py-2 px-10 bg-cyan-500 text-slate-900 rounded-3xl hover:scale-105 transition duration-500 ease-out"
                    onClick={() => {
                        router.push("/pools/newpool")
                    }}
                >
                    CREATE POOL
                </button>
            </div>
        </main>
    )
}
