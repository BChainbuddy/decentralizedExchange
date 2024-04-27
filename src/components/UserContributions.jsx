"use client"

import { useEffect, useState } from "react"
import Modal from "./Modal"
import { useAccount } from "wagmi"

export default function UserContributions({ symbolOne, symbolTwo, contract }) {
    // Add liquidity Modal
    const [displayModal, setDisplayModal] = useState(false)
    const [amountOfTokenOne, setAmountOfTokenOne] = useState(0)
    const [amountOfTokenTwo, setAmountOfTokenTwo] = useState(0)
    const [symbolOneAddLiquidity, setsymbolOneAddLiquidity] = useState(null) // Symbols which are only on the modal, for switch purposes
    const [symbolTwoAddLiquidity, setsymbolTwoAddLiquidity] = useState(null)

    // Remove liquidity Modal
    const [removeLiquidity, setRemoveLiquidity] = useState(0)
    const [displayModal3, setDisplayModal3] = useState(false)

    // Get yield Modal
    const [displayModal2, setDisplayModal2] = useState(false)
    const [timeLeft, setTimeLeft] = useState(0)

    // User contribution stats
    const [userLpTokens, setUserLpTokens] = useState()
    const [userYieldDistributed, setUserYieldDistributed] = useState(0)

    const { address, isConnected } = useAccount()

    // Calls a smart contract function to calculate opposite token amount, called in add liquidity modal
    const getAmountOfTokenNeeded = async a => {
        if (a > 0) {
            setAmountOfTokenOne(a)
            console.log(`This is the amout of input ${ethers.utils.parseEther(a).toString()}`)
            let address
            if (symbolOne === symbolOneAddLiquidity) {
                address = addressOne
            } else {
                address = addressTwo
            }
            const amountNeeded = await contract.amountOfOppositeTokenNeeded(
                address.toString(),
                ethers.utils.parseEther(a)
            )
            console.log(`This is the amout of input ${amountNeeded.toString()}`)
            setAmountOfTokenTwo(ethers.utils.formatEther(amountNeeded))
        }
    }

    // Calls a smart contract function to add liquidity to the pool, called in add liqudity modal
    const addLiquidity = async () => {
        console.log(`Amount of token one ${(amountOfTokenOne * 1.1).toString()}`)
        console.log(`Amount of token two ${(amountOfTokenTwo * 1.1).toString()}`)
        const approvalTx1 = await contractERC20first.approve(
            liquidityPoolAddres,
            ethers.utils.parseEther((amountOfTokenOne * 2).toString())
        )
        const approvalTx2 = await contractERC20second.approve(
            liquidityPoolAddres,
            ethers.utils.parseEther((amountOfTokenTwo * 2).toString())
        )
        const approvalReceipt1 = await approvalTx1.wait()
        const approvalReceipt2 = await approvalTx2.wait()
        console.log(approvalReceipt1)
        console.log(approvalReceipt2)
        const tx = await contract.addLiquidity(
            addressOne,
            addressTwo,
            ethers.utils.parseEther(amountOfTokenOne)
        )
        const txreceipt = await tx.wait(1)
        console.log(txreceipt)
        console.log(txreceipt.status)
        if (txreceipt.status === 1) {
            console.log(`Liquidity added!`)
            getPoolStats()
        }
    }

    // Calls a smart contract function to remove liquidty from the pool, called in remove liquidity modal
    const removePartLiquidity = async () => {
        if (removeLiquidity > 0 && removeLiquidity <= 100) {
            console.log(`Removing ${Math.round(removeLiquidity)} liqudity...`)
            const tx = await contract.removeLiquidity(Math.round(removeLiquidity))
            const receipt = await tx.wait()
            if (receipt.status === 1) {
                console.log(`Liquidty removed!`)
                getPoolStats()
            }
        }
    }

    // Calls a smart contract function get yield, called in get yield modal
    const claimRewards = async () => {
        const tx = await contract.getYield()
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            console.log(`Yield claimed!`)
            getPoolStats()
        }
    }

    const switchStats = () => {
        const x = symbolOneAddLiquidity
        const y = symbolTwoAddLiquidity

        setAmountOfTokenOne(0)
        setAmountOfTokenTwo(0)
        setsymbolOneAddLiquidity(y)
        setsymbolTwoAddLiquidity(x)
    }

    const getUserStats = async () => {
        // Getting the contract storage variables
        const tokens = await contract.getLpTokenQuantity(address)
        const useryielded = await contract.yieldTaken(address)

        // Updating the state variables
        setUserLpTokens(tokens / 10 ** 36)
        setUserYieldDistributed(useryielded / 10 ** 18)
    }

    useEffect(() => {
        if (contract) {
            getUserStats()
        }
    }, [contract])

    // Time left updates only when modal2 is called
    useEffect(() => {
        if (displayModal2) {
            getTimeLeft()
        }
    }, [displayModal2])

    return (
        <>
            <section className="mx-auto flex flex-col text-white/75 place-items-center shadow-xl shadow-slate-800/90 hover:shadow-2xl mt-24 space-y-16  w-5/12 py-8 px-2 rounded-xl bg-gray-700 border-8 border-gray-600 pb-10">
                <p className="text-center text-2xl text-white">YOUR CONTRIBUTIONS:</p>
                <div className="flex flex-row items-center w-full">
                    <div className="w-1/2 text-center">
                        <p className="text-lg">LIQUIDITY PROVIDED</p>
                        <div
                            role="status"
                            className={`${
                                symbolTwo === "Loading..." ? "" : "hidden"
                            } flex justify-center mt-1`}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-300"
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
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className={`${symbolTwo === "Loading..." ? "hidden" : ""} text-base`}>
                            {Math.floor(userLpTokens).toString()}
                        </p>
                    </div>
                    <div className="flex justify-center w-1/2">
                        <div className="flex flex-col space-y-3">
                            <button
                                onClick={() => {
                                    setDisplayModal(true)
                                }}
                                className="block transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44"
                            >
                                Add liquidity
                            </button>
                            <button
                                onClick={() => {
                                    setDisplayModal3(true)
                                }}
                                className="block transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44"
                            >
                                Remove liquidity
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row items-center w-full">
                    <div className="w-1/2 text-center">
                        <p className="text-lg">YIELD EARNED</p>
                        <div
                            role="status"
                            className={`${
                                symbolTwo === "Loading..." ? "" : "hidden"
                            } flex justify-center mt-1`}
                        >
                            <svg
                                aria-hidden="true"
                                className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-300"
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
                            <span className="sr-only">Loading...</span>
                        </div>
                        <p className={`${symbolTwo === "Loading..." ? "hidden" : ""} text-base`}>
                            {userYieldDistributed.toString()}
                        </p>
                    </div>
                    <div className="flex justify-center w-1/2">
                        <button
                            onClick={() => {
                                setDisplayModal2(true)
                            }}
                            className="transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44"
                        >
                            Get yield
                        </button>
                    </div>
                </div>
            </section>
            <Modal
                isVisible={displayModal}
                onClose={() => {
                    setDisplayModal(false)
                    setAmountOfTokenOne(0)
                    setAmountOfTokenTwo(0)
                    setsymbolOneAddLiquidity(symbolOne)
                    setsymbolTwoAddLiquidity(symbolTwo)
                }}
            >
                <p className="text-center text-white text-2xl">
                    INVEST INTO
                    <span className="text-cyan-300">
                        {symbolOne}/{symbolTwo}
                    </span>
                    LIQUIDITY POOL
                </p>
                <div className="mx-auto mt-10">
                    <p className="text-white text-lg">Input base token</p>
                    <div className="flex flex-row space-x-2">
                        <input
                            onChange={e => {
                                getAmountOfTokenNeeded(e.target.value)
                            }}
                            placeholder="0.00"
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
                    <p className="text-white text-lg">Input base token</p>
                    <div className="flex flex-row space-x-2">
                        <input
                            placeholder={amountOfTokenTwo !== 0 ? amountOfTokenTwo : "0.00"}
                            min="0"
                            disabled
                            className="pl-1 rounded"
                        ></input>
                        <p className="text-white text-xl w-12 text-center">
                            {symbolTwoAddLiquidity}
                        </p>
                    </div>
                </div>
                <button
                    className={`${
                        amountOfTokenTwo > 0
                            ? "transition ease-in-out duration-500 hover:scale-110 hover:bg-cyan-700 bg-cyan-500"
                            : "bg-cyan-500/20"
                    } mt-6 mx-auto border  rounded-xl p-2 text-white`}
                    onClick={() => {
                        addLiquidity()
                    }}
                    disabled={amountOfTokenTwo > 0 ? false : true}
                >
                    ADD LIQUIDITY
                </button>
                <p className="text-center mt-7 text-white text-lg">
                    Invest to start earning <span className="text-cyan-300">rewards</span> from the
                    pool TODAY!
                </p>
            </Modal>
            <Modal
                isVisible={displayModal2}
                onClose={() => {
                    setDisplayModal2(false)
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
                            The rewards are <span className="text-cyan-300">available</span> to
                            claim
                        </span>
                        <span className={timeLeft === 0 ? "hidden" : "flex"}>
                            You have to wait for{" "}
                            <span id="time" className="ml-1 text-cyan-300">
                                {" "}
                            </span>{" "}
                            !
                        </span>
                    </p>
                </div>
            </Modal>
            <Modal
                isVisible={displayModal3}
                onClose={() => {
                    setDisplayModal3(false)
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
        </>
    )
}
