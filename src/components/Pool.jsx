import { useReadContract } from "wagmi"
import ABI from "../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../constants/ERC20Abi.json"
import { useRouter } from "next/navigation"
import { shortenSymbol } from "@/utils/shortenSymbol"
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
            className="transition-all duration-500 border-2 text-gray-400 cursor-pointer text-center rounded-xl py-2 space-y-3 hover:shadow-lg hover:shadow-cyan-500 hover:-translate-y-2 w-44 h-52 bg-slate-800"
            onClick={() => {
                router.push(`/pools/${pool}`)
            }}
            id="Pool"
        >
            {symbolOne && symbolTwo ? (
                <>
                    <div className="mt-2">
                        <p className="text-lg font-bold text-white poolAttributes">
                            {`${symbolOne.length > 6 ? shortenSymbol(symbolOne, 5) : symbolOne}/${
                                symbolTwo.length > 6 ? shortenSymbol(symbolTwo, 5) : symbolTwo
                            }`}
                        </p>
                        <p className="text-sm mt-2 poolAttributes">
                            price:{" "}
                            <span>{(Number(getPrice) / 10 ** 18).toFixed(2).toString()}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-base font-bold text-white poolAttributes">
                            YIELD GIVEN
                        </p>
                        <p className="poolAttributes">
                            {yielded ? (Number(yielded) / 10 ** 18).toString() : "0"}
                        </p>
                    </div>
                    <div>
                        <p className="text-base font-bold text-white poolAttributes">
                            TTL LIQUIDITY
                        </p>
                        <p className="poolAttributes">
                            {liquidity ? Math.floor(Number(liquidity) / 10 ** 36).toString() : ""}
                        </p>
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col space-y-2 justify-center items-center">
                    <svg
                        aria-hidden="true"
                        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-500"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <p className="text-sm">Loading pool...</p>
                </div>
            )}
        </div>
    )
}
