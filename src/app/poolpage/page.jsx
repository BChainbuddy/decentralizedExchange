"use client"

import { Montserrat } from "next/font/google"
import { useState, useEffect } from "react"
import CONTRACT_ADDRESS from "../../constants/LiquidityPoolAddress.json"
import ABI from "../../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../../constants/ERC20abi.json"
import { useAccount, useReadContract } from "wagmi"
import StatsDisplay from "@/components/StatsDisplay"
import UserContributions from "@/components/UserContributions"

const monserrat = Montserrat({
    subsets: ["latin"],
    weight: ["400"]
})

export default function poolPage() {
    // Liquidity Pool stats
    const liquidityPoolAddress = CONTRACT_ADDRESS["11155111"][0]
    const [yieldDistributed, setYieldDistributed] = useState(0)
    const [totalLiquidity, setTotalLiquidity] = useState(0)
    const [price, setPrice] = useState(0)

    // Token contracts
    const [addressOne, setAddressOne] = useState(0)
    const [addressTwo, setAddressTwo] = useState(0)

    const { isConnected } = useAccount()

    // READ YIELD, LIQUIDITY, ASSETONEADDRESS, ASSETTWOADDRESS, ASSETONEPRICE
    const { data: yielded } = useReadContract({
        abi: ABI,
        address: liquidityPoolAddress,
        functionName: "yieldAmount"
    })

    const { data: liquidity } = useReadContract({
        abi: ABI,
        address: liquidityPoolAddress,
        functionName: "getLiquidity"
    })

    const { data: getAddressOne } = useReadContract({
        abi: ABI,
        address: liquidityPoolAddress,
        functionName: "assetOneAddress"
    })

    const { data: getAddressTwo } = useReadContract({
        abi: ABI,
        address: liquidityPoolAddress,
        functionName: "assetTwoAddress"
    })

    const { data: getPrice } = useReadContract({
        abi: ABI,
        address: liquidityPoolAddress,
        functionName: "assetOnePrice"
    })

    const { data: symbolOne } = useReadContract({
        abi: ERC20ABI,
        address: getAddressOne,
        functionName: "symbol"
    })

    const { data: symbolTwo } = useReadContract({
        abi: ERC20ABI,
        address: getAddressTwo,
        functionName: "symbol"
    })

    // Getting the liquidity pool stats from the contract
    const getPoolStats = async () => {
        // Updating the state variables
        console.log(yielded.toString())
        console.log(liquidity.toString())
        console.log(useryielded.toString())
        setYieldDistributed(Number(yielded) / 10 ** 18)
        setTotalLiquidity(Math.floor(Number(liquidity) / 10 ** 36))
        setAddressOne(getAddressOne)
        setAddressTwo(getAddressTwo)
        setPrice((Number(getPrice) / 10 ** 18).toFixed(2))
        // Logging the contract storage variables to check if correct
    }

    // Function for number counting animation, counts the pool liquidity and yield
    function numberCounter() {
        let countingY = 0
        let countingL = 0

        const totalYield = yieldDistributed
        const liquidities = totalLiquidity

        const div1 = totalYield / 1000
        const div2 = liquidities / 1000

        let counter = setInterval(count, 1)

        function count() {
            const matches = document.querySelectorAll(".number")
            if (matches.length > 0) {
                if (countingY + div1 <= totalYield) {
                    countingY += div1
                    matches[0].innerHTML = countingY.toFixed(5)
                } else {
                    countingY = totalYield
                    matches[0].innerHTML = countingY.toFixed(5)
                }

                if (countingL + div2 <= liquidities) {
                    countingL += div2
                    matches[1].innerHTML = Math.floor(countingL)
                } else {
                    countingL = liquidities
                    matches[1].innerHTML = Math.floor(countingL)
                }

                if (totalYield === countingY && liquidities === countingL) {
                    clearInterval(counter)
                    console.log("The interval is closed")
                }
            }
        }
    }

    // Resets all the stats, only if we disconnect from the app
    const resetStats = () => {
        setYieldDistributed(0)
        setTotalLiquidity(0)
        setPrice(0)

        setAddressOne(0)
        setAddressTwo(0)

        const matches = document.querySelectorAll(".number")
        matches[0].innerHTML = "0"
        matches[1].innerHTML = "0"
    }

    // Executes functions when isConnected changes
    useEffect(() => {
        if (isConnected) {
            getPoolStats()
        } else {
            resetStats()
        }
    }, [isConnected])

    // Executes number counter only when the symbolTwo is received by the contract
    useEffect(() => {
        if (symbolTwo !== "Loading...") {
            numberCounter()
        }
    }, [symbolTwo])

    return (
        <div className={monserrat.className}>
            <main className="flex flex-col">
                <section className="flex flex-row text-gray-400 px-28 mt-16">
                    <StatsDisplay
                        src={"http://www.w3.org/2000/svg"}
                        title={"YIELD DISTRIBUTED"}
                        value={yieldDistributed}
                        path={
                            "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                        }
                    />
                    <div className="flex flex-col text-center w-1/3">
                        <p className="text-sm">LIQUIDITY POOL</p>
                        <p
                            className={`${
                                symbolTwo === "Loading..." ? "animate-pulse" : "animate-none"
                            } text-3xl text-cyan-500`}
                        >
                            {symbolOne ? symbolOne : "Loading..."}/
                            {symbolTwo ? symbolOne : "Loading..."}
                        </p>
                        <p className="text-lg mt-2">{price}</p>
                    </div>
                    <StatsDisplay
                        src={"http://www.w3.org/2000/svg"}
                        title={"TOTAL LIQUIDITY"}
                        value={totalLiquidity}
                        path={
                            "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                        }
                    />
                </section>
                <UserContributions
                    addressOne={addressOne}
                    addressTwo={addressTwo}
                    symbolOne={symbolOne}
                    symbolTwo={symbolTwo}
                />
            </main>
        </div>
    )
}
