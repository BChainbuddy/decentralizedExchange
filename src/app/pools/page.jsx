"use client"

import { Montserrat } from "next/font/google"
import { useAccount, useReadContract, useReadContracts } from "wagmi"
import POOLTRACKER_ABI from "../../constants/PoolTrackerAbi.json"
import POOLTRACKER_ADDRESS from "../../constants/PoolTrackerAddress.json"
import PoolList from "@/components/PoolList"
import ABI from "../../constants/LiquidityPoolAbi.json"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function liquidityPools() {
    const { address } = useAccount()

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
            const userList = poolList.map((pool, i) => {
                if (userContributions[i] > 0) {
                    return pool
                }
            })
            if (userList[0] === undefined) {
                return undefined
            }
        } else {
            return undefined
        }
    }

    return (
        <div className={monserrat.className}>
            <div className="mt-10">
                <div className="flex flex-col place-items-center">
                    <h1 className="text-gray-400 text-2xl">CONTRIBUTED TO</h1>
                    {poolList ? <PoolList poolList={contributedPools()} /> : "Loading pools..."}
                </div>
                <div className="flex flex-col place-items-center">
                    <h1 className="text-gray-400 text-xl">TOP LIQUIDITY POOLS</h1>
                    {poolList ? <PoolList poolList={poolList} /> : "Loading pools..."}
                </div>
                <div className="flex flex-col place-items-center space-y-3">
                    <h1 className="text-gray-400 text-lg">Want to start a liquidity pool?</h1>
                    <button className="py-2 px-10 bg-cyan-500 text-slate-900 rounded-3xl">
                        CREATE POOL
                    </button>
                </div>
            </div>
        </div>
    )
}
