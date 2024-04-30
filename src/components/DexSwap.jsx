"use client"

import { useWriteContract, useReadContract, useAccount } from "wagmi"
import SWAPROUTER_ADDRESS from "../constants/DexAddress.json"
import SWAPROUTER_ABI from "../constants/DexAbi.json"
import { ethers } from "ethers"
import ERC20ABI from "../constants/ERC20abi.json"

export default function DexSwap({ chosenTokenInput, chosenTokenOutput, inputAmount }) {
    const { address } = useAccount()

    const {
        status: approveTokenInputStatus,
        writeContract: approveTokenInput,
        isPending: pendingApproval,
        error: inputError
    } = useWriteContract()

    const {
        status: swapAssetStatus,
        isPending: pendingSwap,
        writeContract: swapAsset
    } = useWriteContract()

    const { data: allowanceInput } = useReadContract({
        abi: ERC20ABI,
        address: chosenTokenInput.address,
        functionName: "allowance",
        args: [address, SWAPROUTER_ADDRESS["11155111"].toString()]
    })

    const { data: feeAmount } = useReadContract({
        abi: SWAPROUTER_ABI,
        address: SWAPROUTER_ADDRESS["11155111"].toString(),
        functionName: "getSwapFee",
        args: [chosenTokenInput.address, chosenTokenOutput.address]
    })

    const { data: swapAmount } = useReadContract({
        abi: SWAPROUTER_ABI,
        address: SWAPROUTER_ADDRESS["11155111"].toString(),
        functionName: "getSwapAmount",
        args: [chosenTokenInput.address, chosenTokenOutput.address, inputAmount]
    })

    const handleClick = () => {
        if (Number(allowanceInput) / 10 ** 18 < inputAmount) {
            approveToken()
            return
        }
        swap()
    }

    const approveToken = () => {
        try {
            approveTokenInput({
                abi: ERC20ABI,
                address: chosenTokenInput.address,
                functionName: "approve",
                args: [
                    SWAPROUTER_ADDRESS["11155111"].toString(),
                    ethers.parseEther((inputAmount * 2).toString())
                ]
            })
        } catch (error) {
            console.log(error)
        }
    }

    const swap = () => {
        try {
            swapAsset({
                abi: SWAPROUTER_ABI,
                address: SWAPROUTER_ADDRESS["11155111"].toString(),
                functionName: "swapAsset",
                args: [
                    chosenTokenInput.address,
                    chosenTokenOutput.address,
                    ethers.parseEther(inputAmount.toString())
                ],
                value: feeAmount
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <p className="text-start ml-2 mt-3 text-sm">
                Estimated gas fee: <span>{feeAmount ? Number(feeAmount) / 10 ** 18 : "0"}</span>
            </p>
            <button
                className={`border-2 rounded-lg py-2 text-center mt-6 w-32 transition-all duration-500 ease-out ${
                    inputAmount && chosenTokenInput !== "Symbol" && chosenTokenOutput !== "Symbol"
                        ? "bg-cyan-500 hover:bg-cyan-600 hover:scale-105 text-white"
                        : ""
                }`}
                onClick={handleClick}
                disabled={inputAmount === 0}
            >
                {Number(allowanceInput) / 10 ** 18 >= inputAmount ||
                chosenTokenInput.symbol === "Symbol"
                    ? "SWAP"
                    : "APPROVE"}
            </button>
        </div>
    )
}
