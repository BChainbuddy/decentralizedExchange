import { useState } from "react"
import Modal from "./Modal"
import { useWriteContract } from "wagmi"
import ABI from "../constants/LiquidityPoolAbi.json"
import CircleLoading from "@/ui/CircleLoading"
import TxPopup from "./TxPopup"

export default function RemoveLiquidity({ closeModal, displayModal, poolAddress }) {
    const [percent, setPercent] = useState(0)

    const { status, data, writeContract: removeLiquidity, isPending } = useWriteContract()

    const removePartLiquidity = async () => {
        if (percent > 0 && percent <= 100) {
            removeLiquidity({
                abi: ABI,
                address: poolAddress,
                functionName: "removeLiquidity",
                args: [Math.round(percent)]
            })
        }
    }

    return (
        <>
            <Modal
                isVisible={displayModal}
                onClose={() => {
                    closeModal(false)
                    setPercent(0)
                }}
            >
                <p className="text-center text-white text-2xl">
                    <span className="text-cyan-300">REMOVE</span> THE LIQUIDITY
                </p>
                <div className="mt-8 mx-auto">
                    <input
                        onChange={e => {
                            setPercent(e.target.value)
                        }}
                        placeholder="0"
                        type="number"
                        min="0"
                        step="1"
                        className="pl-1 rounded"
                        max="100"
                    />
                </div>
                <button
                    onClick={() => {
                        removePartLiquidity()
                    }}
                    disabled={percent === 0 || percent > 100 ? true : false}
                    className={`${
                        percent <= 100 && percent > 0
                            ? "transition ease-in-out duration-500 hover:bg-cyan-700 bg-cyan-500"
                            : "bg-cyan-500/20"
                    } mt-6 mx-auto border rounded-xl p-2 text-white w-48 h-11`}
                >
                    {isPending ? (
                        <div className="flex justify-center items-center h-6 w-full">
                            <CircleLoading />
                        </div>
                    ) : (
                        "REMOVE LIQUIDITY"
                    )}
                </button>
                <p className="text-white text-center mt-6">
                    Input a <span className="text-cyan-300">percent</span> of liquidity you want to
                    remove
                </p>
            </Modal>
            <TxPopup hash={data} status={status} />
        </>
    )
}
