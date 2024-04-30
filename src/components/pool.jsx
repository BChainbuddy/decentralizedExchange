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

    return (
        <div
            className="transition-all duration-500 border-2 text-gray-400 cursor-pointer text-center rounded-xl px-3 py-2 space-y-3 hover:shadow-xl hover:shadow-cyan-500 hover:text-cyan-500 hover:-translate-y-2"
            onClick={() => {
                router.push(`/pools/${pool}`)
            }}
        >
            <div className="mt-2">
                <p className="text-xl">
                    {symbolTwo && symbolOne ? `${symbolOne}/${symbolTwo}` : "Loading pool..."}
                </p>
                <p className="text-sm mt-2">
                    price: <span>{(Number(getPrice) / 10 ** 18).toFixed(2).toString()}</span>
                </p>
            </div>
            <div>
                <p className="text-base">YIELD GIVEN</p>
                <p>{yielded ? (Number(yielded) / 10 ** 18).toString() : ""}</p>
            </div>
            <div>
                <p className="text-base">TTL LIQUIDITY</p>
                <p>{liquidity ? Math.floor(Number(liquidity) / 10 ** 36).toString() : ""}</p>
            </div>
        </div>
    )
}
