import { useEffect, useState } from "react"
import Modal from "./Modal"
import { useReadContract, useWriteContract, useAccount } from "wagmi"
import ABI from "../constants/LiquidityPoolAbi.json"
import CircleLoading from "@/ui/circleLoading"
import TxPopup from "./TxPopup"

export default function ClaimRewards({ closeModal, displayModal, poolAddress }) {
    const { address } = useAccount()

    const { status, data, writeContract: claimRewards, isPending } = useWriteContract()

    const { data: timeLeft } = useReadContract({
        abi: ABI,
        address: poolAddress,
        functionName: "lastYieldFarmedTime",
        args: [address]
    })

    const { data: isTime } = useReadContract({
        abi: ABI,
        address: poolAddress,
        functionName: "isTime",
        account: address
    })

    const getTimeLeft = async () => {
        if (!isTime && timeLeft) {
            // console.log("TimeLock is on")
            const timestamp = timeLeft
            const currentTimeStamp = Math.round(Date.now() / 1000)
            const time = parseInt(timestamp) + 24 * 60 * 60 - currentTimeStamp
            const hoursLeft = Math.floor(time / 60 / 60)
            const minutesLeft = Math.floor(time / 60) % 24
            if (document.getElementById("time") !== null) {
                document.getElementById("time").innerHTML = `${hoursLeft} H ${minutesLeft} min`
            }
        }
        // console.log("TimeLock is not on")
    }

    const handleClaimRewards = async () => {
        claimRewards({
            address: poolAddress,
            abi: ABI,
            functionName: "getYield"
        })
    }

    useEffect(() => {
        if (displayModal) {
            getTimeLeft()
        }
    }, [displayModal])

    return (
        <>
            <Modal
                isVisible={displayModal}
                onClose={() => {
                    closeModal(false)
                }}
            >
                <p className="text-center text-white text-2xl">
                    CLAIM THE <span className="text-cyan-300">REWARDS</span>
                </p>
                <button
                    className={`${
                        isTime
                            ? "transition ease-in-out duration-500 hover:bg-cyan-700 bg-cyan-500"
                            : "bg-cyan-500/20"
                    } mt-6 mx-auto border  rounded-xl p-2 text-white w-44 h-11`}
                    onClick={handleClaimRewards}
                    disabled={isTime ? false : true}
                >
                    {isPending ? (
                        <div className="flex justify-center items-center h-6 w-full">
                            <CircleLoading />
                        </div>
                    ) : (
                        "CLAIM REWARDS"
                    )}
                </button>
                <div className="mx-auto mt-8">
                    <p className="text-white">
                        <span className={isTime ? "flex" : "hidden"}>
                            The rewards are{" "}
                            <span className="text-cyan-300 mr-1 ml-1">available</span> to claim
                        </span>
                        <span className={isTime ? "hidden" : "flex"}>
                            You have to wait for
                            <span id="time" className="ml-1 text-cyan-300"></span>!
                        </span>
                    </p>
                </div>
            </Modal>
            <TxPopup hash={data} status={status} />
        </>
    )
}
