import { useAccount, useReadContract, useWriteContract } from "wagmi"
import POOLTRACKER_ABI from "../constants/PoolTrackerAbi.json"
import POOLTRACKER_ADDRESS from "../constants/PoolTrackerAddress.json"
import ERC20ABI from "../constants/ERC20Abi.json"
import { ethers } from "ethers"
import CircleLoading from "@/ui/CircleLoading"
import TxPopup from "./TxPopup"

export default function DeployPool({ amountToken1, amountToken2, chosenToken1, chosenToken2 }) {
    const { address } = useAccount()
    const {
        status: deployStatus,
        data: deployHash,
        writeContract: deployPool,
        isPending: pendingDeploy
    } = useWriteContract()

    const {
        status: approveToken1Status,
        data: approveToken1Hash,
        writeContract: approveToken1,
        isPending: pendingApproval1,
        error: inputError1
    } = useWriteContract()

    const {
        status: approveToken2Status,
        data: approveToken2Hash,
        writeContract: approveToken2,
        isPending: pendingApproval2,
        error: inputError2
    } = useWriteContract()

    const { data: exists } = useReadContract({
        address: POOLTRACKER_ADDRESS["11155111"],
        abi: POOLTRACKER_ABI,
        functionName: "exists",
        args: [chosenToken1.address, chosenToken2.address]
    })

    const { data: allowanceToken1 } = useReadContract({
        abi: ERC20ABI,
        address: chosenToken1.address,
        functionName: "allowance",
        args: [address, POOLTRACKER_ADDRESS["11155111"]]
    })

    const { data: allowanceToken2 } = useReadContract({
        abi: ERC20ABI,
        address: chosenToken2.address,
        functionName: "allowance",
        args: [address, POOLTRACKER_ADDRESS["11155111"]]
    })

    const handleClick = () => {
        console.log(Number(allowanceToken1) / 10 ** 18 < amountToken1)
        console.log(Number(allowanceToken2) / 10 ** 18 < amountToken2)
        console.log(amountToken1)
        console.log(amountToken2)
        if (
            Number(allowanceToken1) / 10 ** 18 < amountToken1 ||
            Number(allowanceToken2) / 10 ** 18 < amountToken2
        ) {
            console.log("Approving...")
            approveToken()
            return
        }
        handleDeploy()
    }

    const approveToken = () => {
        try {
            if (Number(allowanceToken1) / 10 ** 18 < amountToken1) {
                approveToken1({
                    abi: ERC20ABI,
                    address: chosenToken1.address,
                    functionName: "approve",
                    args: [
                        POOLTRACKER_ADDRESS["11155111"],
                        ethers.parseEther((amountToken1 * 2).toString())
                    ]
                })
            }
            if (Number(allowanceToken2) / 10 ** 18 < amountToken2) {
                approveToken2({
                    abi: ERC20ABI,
                    address: chosenToken2.address,
                    functionName: "approve",
                    args: [
                        POOLTRACKER_ADDRESS["11155111"],
                        ethers.parseEther((amountToken2 * 2).toString())
                    ]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeploy = () => {
        try {
            deployPool({
                address: POOLTRACKER_ADDRESS["11155111"],
                abi: POOLTRACKER_ABI,
                functionName: "createPool",
                args: [
                    chosenToken1.address,
                    chosenToken2.address,
                    ethers.parseEther(amountToken1.toString()),
                    ethers.parseEther(amountToken2.toString())
                ]
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="flex flex-row items-center mt-6">
                <div
                    className={`rounded-full h-4 w-4 transition duration-300 ${
                        !chosenToken1.address || !chosenToken2.address
                            ? "bg-white"
                            : exists
                            ? "bg-red-500"
                            : "bg-green-500"
                    }`}
                ></div>
                <p
                    className={`ml-1 transition duration-300 ${
                        !chosenToken1.address || !chosenToken2.address
                            ? "text-white"
                            : exists
                            ? "text-red-500"
                            : "text-green-500"
                    }`}
                >
                    Is available
                </p>
            </div>
            <button
                className={`py-1 px-6 rounded-xl text-black mt-6 text-lg transition-all duration-500 ease-out w-40 h-9 ${
                    exists || !chosenToken1.address || !chosenToken2.address
                        ? "bg-cyan-800"
                        : "bg-cyan-500 hover:bg-cyan-600"
                }`}
                disabled={exists || !chosenToken1.address || !chosenToken2.address}
                onClick={handleClick}
            >
                {pendingDeploy || pendingApproval1 || pendingApproval2 ? (
                    <div className="flex justify-center items-center h-4 w-full">
                        <CircleLoading />
                    </div>
                ) : (
                    <>
                        {Number(allowanceToken1) / 10 ** 18 >= amountToken1 &&
                        Number(allowanceToken2) / 10 ** 18 >= amountToken2
                            ? "DEPLOY"
                            : "APPROVE"}
                    </>
                )}
            </button>
            <TxPopup hash={approveToken1Hash} status={approveToken1Status} />
            <TxPopup hash={approveToken2Hash} status={approveToken2Status} />
            <TxPopup hash={deployHash} status={deployStatus} />
        </>
    )
}
