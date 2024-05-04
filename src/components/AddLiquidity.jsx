import { useEffect, useState } from "react"
import Modal from "./Modal"
import { ethers } from "ethers"
import ERC20ABI from "../constants/ERC20Abi.json"
import { useAccount, useReadContract, useWriteContract } from "wagmi"
import ABI from "../constants/LiquidityPoolAbi.json"
import CircleLoading from "@/ui/CircleLoading"
import TxPopup from "./TxPopup"

export default function AddLiquidity({
    displayModal,
    closeModal,
    symbolOne,
    symbolTwo,
    addressOne,
    addressTwo,
    poolAddress
}) {
    const [inputAmount, setInputAmount] = useState(0)
    const [inputAddress, setInputAddress] = useState("")
    const [symbolOneAddLiquidity, setSymbolOneAddLiquidity] = useState(null) // Symbols which are only on the modal, for switch purposes
    const [symbolTwoAddLiquidity, setSymbolTwoAddLiquidity] = useState(null)

    const { address } = useAccount()

    const { data: allowanceInput1 } = useReadContract({
        abi: ERC20ABI,
        address: inputAddress,
        functionName: "allowance",
        args: [address, poolAddress]
    })

    const { data: allowanceInput2 } = useReadContract({
        abi: ERC20ABI,
        address: inputAddress === addressOne ? addressTwo : addressOne,
        functionName: "allowance",
        args: [address, poolAddress]
    })

    const {
        status: statusApprove1,
        data: hashApprove1,
        writeContract: approveToken1,
        isPending: pendingApproval1
    } = useWriteContract()

    const {
        status: statusApprove2,
        data: hashApprove2,
        writeContract: approveToken2,
        isPending: pendingApproval2
    } = useWriteContract()

    const {
        status: addLiquidityStatus,
        data: addLiquidityHash,
        writeContract: addLiquidityFunc,
        isPending: pendingAddLiquidity
    } = useWriteContract()

    const { data: amountNeeded } = useReadContract({
        abi: ABI,
        address: poolAddress,
        functionName: "amountOfOppositeTokenNeeded",
        args: [inputAddress, ethers.parseEther(inputAmount.toString())]
    })

    const handleClick = () => {
        if (
            Number(allowanceInput1) / 10 ** 18 < inputAmount ||
            Number(allowanceInput2) / 10 ** 18 < Number(amountNeeded) / 10 ** 18
        ) {
            console.log("Approving...")
            approveToken()
            return
        }
        addLiquidity()
    }

    const approveToken = () => {
        try {
            if (Number(allowanceInput1) / 10 ** 18 < inputAmount) {
                approveToken1({
                    abi: ERC20ABI,
                    address: inputAddress,
                    functionName: "approve",
                    args: [poolAddress, ethers.parseEther((inputAmount * 2).toString())]
                })
            }
            if (Number(allowanceInput2) / 10 ** 18 < Number(amountNeeded) / 10 ** 18) {
                approveToken2({
                    abi: ERC20ABI,
                    address: inputAddress === addressOne ? addressTwo : addressOne,
                    functionName: "approve",
                    args: [poolAddress, ethers.parseEther((Number(amountNeeded) * 2).toString())]
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const addLiquidity = () => {
        try {
            addLiquidityFunc({
                abi: ABI,
                address: poolAddress,
                functionName: "addLiquidity",
                args: [addressOne, addressTwo, ethers.parseEther(inputAmount.toString())]
            })
        } catch (error) {
            console.log(error)
        }
    }

    const switchStats = () => {
        setInputAmount(0)
        if (addressOne === inputAddress) {
            setInputAddress(addressTwo)
            setSymbolOneAddLiquidity(symbolTwo)
        } else {
            setInputAddress(addressOne)
            setSymbolTwoAddLiquidity(symbolOne)
        }
    }

    useEffect(() => {
        if (symbolTwo) {
            setSymbolOneAddLiquidity(symbolOne)
            setSymbolTwoAddLiquidity(symbolTwo)
        }
    }, [symbolTwo])

    useEffect(() => {
        if (addressOne) {
            setInputAddress(addressOne)
        }
    }, [addressOne])

    return (
        <>
            <Modal
                isVisible={displayModal}
                onClose={() => {
                    closeModal(false)
                    setInputAmount(0)
                    setSymbolOneAddLiquidity(symbolOne)
                    setSymbolTwoAddLiquidity(symbolTwo)
                }}
            >
                <p className="text-center text-white text-2xl">
                    INVEST INTO
                    <span className="text-cyan-300 mr-1 ml-1">
                        {symbolOne && symbolTwo ? `${symbolOne}/${symbolTwo}` : "Loading..."}
                    </span>
                    LIQUIDITY POOL
                </p>
                <div className="mx-auto mt-10">
                    <p className="text-white text-lg">Input base token</p>
                    <div className="flex flex-row space-x-2">
                        <input
                            onChange={e => {
                                if (e.target.value > 0) {
                                    setInputAmount(e.target.value)
                                } else {
                                    setInputAmount(0)
                                }
                            }}
                            placeholder="0"
                            type="number"
                            min="0"
                            step="0.1"
                            className="pl-1 rounded"
                        />
                        <p className="text-white text-xl w-12 text-center">
                            {symbolOneAddLiquidity}
                        </p>
                    </div>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#FFFFFF"
                    className="w-6 h-6 mx-auto mt-3 cursor-pointer"
                    onClick={() => {
                        switchStats()
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                    />
                </svg>
                <div className="mx-auto mt-3">
                    <p className="text-white text-lg">Tokens needed</p>
                    <div className="flex flex-row space-x-2">
                        <input
                            placeholder={
                                inputAmount && amountNeeded > 0
                                    ? Number(amountNeeded) / 10 ** 18
                                    : "0"
                            }
                            min="0"
                            disabled
                            className={`pl-1 rounded bg-white ${
                                inputAmount ? "placeholder:text-gray-600" : ""
                            }`}
                        ></input>
                        <p className="text-white text-xl w-12 text-center">
                            {symbolTwoAddLiquidity}
                        </p>
                    </div>
                </div>
                <button
                    className={`${
                        inputAmount > 0
                            ? "transition ease-in-out duration-500 hover:bg-cyan-700 bg-cyan-500"
                            : "bg-cyan-500/20"
                    } mt-6 mx-auto border  rounded-xl p-2 text-white w-36 h-11`}
                    onClick={handleClick}
                    disabled={inputAmount > 0 ? false : true}
                >
                    {pendingApproval1 || pendingApproval2 || pendingAddLiquidity ? (
                        <div className="flex justify-center items-center h-6 w-full">
                            <CircleLoading />
                        </div>
                    ) : (
                        <>
                            {Number(allowanceInput1) / 10 ** 18 >= inputAmount &&
                            Number(allowanceInput2) / 10 ** 18 >= Number(amountNeeded) / 10 ** 18
                                ? "ADD LIQUIDITY"
                                : "APPROVE"}
                        </>
                    )}
                </button>
                <p className="text-center mt-7 text-white text-lg">
                    Invest to start earning <span className="text-cyan-300">rewards</span> from the
                    pool TODAY!
                </p>
            </Modal>
            <TxPopup hash={addLiquidityHash} status={addLiquidityStatus} />
            <TxPopup hash={hashApprove1} status={statusApprove1} />
            <TxPopup hash={hashApprove2} status={statusApprove2} />
        </>
    )
}
