import { useState } from "react"
import Modal from "./Modal"

export default function RemoveLiquidity({ closeModal, displayModal, contract }) {
    // Calls a smart contract function to remove liquidity from the pool, called in remove liquidity modal
    const [removeLiquidity, setRemoveLiquidity] = useState(0)

    const removePartLiquidity = async () => {
        if (removeLiquidity > 0 && removeLiquidity <= 100) {
            console.log(`Removing ${Math.round(removeLiquidity)} liqudity...`)
            const tx = await contract.removeLiquidity(Math.round(removeLiquidity))
            const receipt = await tx.wait()
            if (receipt.status === 1) {
                console.log(`Liquidty removed!`)
                // getPoolStats()
            }
        }
    }
    return (
        <Modal
            isVisible={displayModal}
            onClose={() => {
                closeModal(false)
                setRemoveLiquidity(0)
            }}
        >
            <p className="text-center text-white text-2xl">
                <span className="text-cyan-300">REMOVE</span> THE LIQUIDITY
            </p>
            <div className="mt-8 mx-auto">
                <input
                    onChange={e => {
                        setRemoveLiquidity(e.target.value)
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
                disabled={removeLiquidity === 0 || removeLiquidity > 100 ? true : false}
                className={`${
                    removeLiquidity <= 100 && removeLiquidity > 0
                        ? "transition ease-in-out duration-500 hover:scale-110 hover:bg-cyan-700 bg-cyan-500"
                        : "bg-cyan-500/20"
                } mt-6 mx-auto border  rounded-xl p-2 text-white`}
            >
                REMOVE LIQUIDITY
            </button>
            <p className="text-white text-center mt-6">
                Input a <span className="text-cyan-300">percent</span> of liquidity you want to
                remove
            </p>
        </Modal>
    )
}
