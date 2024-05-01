import { useReadContract } from "wagmi"
import ABI from "../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../constants/ERC20abi.json"
import { useRouter } from "next/navigation"
export default function Pool({ pool }) {
    const { data: yielded } = useReadContract({
        abi: ABI,
        address: pool,
        functionName: "yieldAmount"
    })

    const { data: liquidity } = useReadContract({
        abi: ABI,
        address: pool,
        functionName: "getLiquidity"
    })

    const { data: getAddressOne } = useReadContract({
        abi: ABI,
        address: pool,
        functionName: "assetOneAddress"
    })

    const { data: getAddressTwo } = useReadContract({
        abi: ABI,
        address: pool,
        functionName: "assetTwoAddress"
    })

    const { data: getPrice } = useReadContract({
        abi: ABI,
        address: pool,
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

    const router = useRouter()

    function shortenSymbol(longSymbol) {
        const newSymbol = longSymbol.substring(0, 5).toString() + ".."
        return newSymbol
    }

    return (
        <div
            className="transition-all duration-500 border-2 text-gray-400 cursor-pointer text-center rounded-xl py-2 space-y-3 hover:shadow-lg hover:shadow-cyan-500 hover:text-cyan-500 hover:-translate-y-2 w-44 h-52"
            onClick={() => {
                router.push(`/pools/${pool}`)
            }}
        >
            <div className="mt-2">
                <p className="text-lg">
                    {symbolTwo && symbolOne
                        ? `${symbolOne.length > 6 ? shortenSymbol(symbolOne) : symbolOne}/${
                              symbolTwo.length > 6 ? shortenSymbol(symbolTwo) : symbolTwo
                          }`
                        : "Loading pool..."}
                </p>
                <p className="text-sm mt-2">
                    price: <span>{(Number(getPrice) / 10 ** 18).toFixed(2).toString()}</span>
                </p>
            </div>
            <div>
                <p className="text-base">YIELD GIVEN</p>
                <p>{yielded ? (Number(yielded) / 10 ** 18).toString() : "0"}</p>
            </div>
            <div>
                <p className="text-base">TTL LIQUIDITY</p>
                <p>{liquidity ? Math.floor(Number(liquidity) / 10 ** 36).toString() : ""}</p>
            </div>
        </div>
    )
}
