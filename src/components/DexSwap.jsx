"use client"

import { useWriteContract, useReadContract } from "wagmi"
import SWAPROUTER_ADDRESS from "../constants/DexAddress.json"
import SWAPROUTER_ABI from "../constants/DexAbi.json"
import { ethers } from "ethers"
import ERC20ABI from "../constants/ERC20abi.json"

export default function DexSwap({ chosenTokenInput, chosenTokenOutput, inputAmount }) {
    const {
        status: approveTokenOutputStatus,
        writeContract: approveTokenOutput
    } = useWriteContract()
    const {
        status: approveTokenInputStatus,
        writeContract: approveTokenInput,
        error: inputError
    } = useWriteContract()
    const { status: swapAssetStatus, writeContract: swapAsset } = useWriteContract()

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

    const swap = () => {
        try {
            console.log(ERC20ABI)
            approveTokenInput({
                abi: ERC20ABI,
                address: chosenTokenInput.address.toString(),
                functionName: "approve",
                args: [
                    SWAPROUTER_ADDRESS["11155111"].toString(),
                    ethers.parseEther((inputAmount * 2).toString())
                ]
            })
            approveTokenOutput({
                abi: ERC20ABI,
                address: chosenTokenOutput.address,
                functionName: "approve",

                args: [
                    SWAPROUTER_ADDRESS["11155111"].toString(),
                    ethers.parseEther((Number(swapAmount) * 2).toString())
                ]
            })
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
                className="border-2 rounded-lg py-2 px-16 mt-6 hover:bg-zinc-300"
                onClick={swap}
                // disabled={inputAmount === 0}
            >
                SWAP
            </button>
        </div>
    )
}
