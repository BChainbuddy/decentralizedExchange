import { useReadContract, useReadContracts } from "wagmi"
import Pool from "./Pool"
import { useState, useEffect } from "react"
import ABI from "../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../constants/ERC20abi.json"

export default function PoolList({ poolList, text }) {
    const [seeAll, setSeeAll] = useState(false)

    const [filteredPools, setFilteredPools] = useState([])

    const { data: getAddressesOne } = useReadContracts({
        contracts: poolList?.map(poolAddress => ({
            address: poolAddress,
            functionName: "assetOneAddress",
            abi: ABI
        })),
        watch: true
    })

    const { data: getAddressesTwo } = useReadContracts({
        contracts: poolList?.map(poolAddress => ({
            address: poolAddress,
            functionName: "assetTwoAddress",
            abi: ABI
        })),
        watch: true
    })

    const { data: symbolsOne } = useReadContracts({
        contracts: getAddressesOne?.map(poolAddress => ({
            address: poolAddress.result,
            functionName: "symbol",
            abi: ERC20ABI
        })),
        watch: true
    })

    const { data: symbolsTwo } = useReadContracts({
        contracts: getAddressesTwo?.map(poolAddress => ({
            address: poolAddress.result,
            functionName: "symbol",
            abi: ERC20ABI
        })),
        watch: true
    })

    function filterPools(text) {
        const pools =
            text !== "" && symbolsOne && symbolsTwo
                ? poolList.filter((pool, i) =>
                      `${symbolsOne[i].result}/${symbolsTwo[i].result}`
                          .toLowerCase()
                          .includes(text.toLowerCase())
                  )
                : poolList
        setFilteredPools(pools)
    }

    useEffect(() => {
        if (poolList) {
            filterPools(text)
        } else {
            filterPools([])
        }
    }, [text])

    return (
        <>
            {filteredPools.length > 0 ? (
                <>
                    <div
                        className={`grid grid-cols-5 gap-x-5 gap-y-10 place-items-center overflow-hidden pt-5 px-8 mt-5 rounded-lg transition-all duration-500 pb-6 ${
                            seeAll ? "max-h-[1000px]" : "max-h-64"
                        }`}
                    >
                        {filteredPools.map((pool, i) => (
                            <Pool pool={pool} key={i} />
                        ))}
                    </div>
                    {filteredPools.length > 5 ? (
                        <button
                            className="bg-cyan-500 py-1 px-2 text-sm text-black rounded-lg transition duration-300 hover:bg-cyan-600"
                            onClick={() => {
                                setSeeAll(!seeAll)
                            }}
                        >
                            {seeAll ? "SEE LESS" : "SEE ALL"}
                        </button>
                    ) : (
                        <></>
                    )}
                </>
            ) : (
                <div className="flex justify-center max-h-64 items-center pt-5 mt-5 pb-6">
                    <p className="text-cyan-500 text-xl text-center">No pools available</p>
                </div>
            )}
        </>
    )
}
