import { useEffect, useState } from "react"
import Modal from "./Modal"

export default function ClaimRewards({
    closeModal,
    displayModal,
    contract,
    address
}) {
    const [timeLeft, setTimeLeft] = useState(0)

    const getTimeLeft = async () => {
        console.log("Get time left...")
        const response = await contract.isTime()
        if (!response) {
            console.log("TimeLock is on")
            const timestamp = await contract.lastYieldFarmedTime(address)
            const currentTimeStamp = Math.round(Date.now() / 1000)
            const timeLeft = parseInt(timestamp) + 24 * 60 * 60 - currentTimeStamp
            setTimeLeft(timeLeft)
            const hoursLeft = Math.floor(timeLeft / 60 / 60)
            const minutesLeft = Math.floor(timeLeft / 60) % 24
            if (document.getElementById("time") !== null) {
                document.getElementById("time").innerHTML = `${hoursLeft} H ${minutesLeft} min`
            }
        }
        console.log("TimeLock is not on")
    }

    // Calls a smart contract function get yield, called in get yield modal
    const claimRewards = async () => {
        const tx = await contract.getYield()
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            console.log(`Yield claimed!`)
            // getPoolStats()
        }
    }

    useEffect(() => {
        if (displayModal) {
            getTimeLeft()
        }
    }, [displayModal])

    return (
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
                    timeLeft === 0
                        ? "transition ease-in-out duration-500 hover:scale-110 hover:bg-cyan-700 bg-cyan-500"
                        : "bg-cyan-500/20"
                } mt-6 mx-auto border  rounded-xl p-2 text-white`}
                onClick={() => {
                    claimRewards()
                }}
                disabled={timeLeft === 0 ? false : true}
            >
                CLAIM REWARDS
            </button>
            <div className="mx-auto mt-8">
                <p className="text-white">
                    <span className={timeLeft === 0 ? "flex" : "hidden"}>
                        The rewards are <span className="text-cyan-300">available</span> to claim
                    </span>
                    <span className={timeLeft === 0 ? "hidden" : "flex"}>
                        You have to wait for
                        <span id="time" className="ml-1 text-cyan-300"></span>!
                    </span>
                </p>
            </div>
        </Modal>
    )
}
