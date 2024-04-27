"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import ClaimRewards from "./ClaimRewards"
import RemoveLiquidity from "./RemoveLiquidity"
import AddLiquidity from "./AddLiquidity"

export default function UserContributions({
    symbolOne,
    symbolTwo,
    contract,
    addressOne,
    addressTwo
}) {
    // Modals display
    const [displayModal, setDisplayModal] = useState(false)
    const [displayModal2, setDisplayModal2] = useState(false)
    const [displayModal3, setDisplayModal3] = useState(false)

    // User contribution stats
    const [userLpTokens, setUserLpTokens] = useState()
    const [userYieldDistributed, setUserYieldDistributed] = useState(0)

    const { address } = useAccount()

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
                                    setDisplayModal2(true)
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
                                setDisplayModal3(true)
                            }}
                            className="transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44"
                        >
                            Get yield
                        </button>
                    </div>
                </div>
            </section>
            <AddLiquidity
                closeModal={setDisplayModal}
                displayModal={displayModal}
                contract={contract}
                symbolOne={symbolOne}
                symbolTwo={symbolTwo}
                addressOne={addressOne}
                addressTwo={addressTwo}
            />
            <RemoveLiquidity
                closeModal={setDisplayModal2}
                displayModal={displayModal2}
                contract={contract}
            />
            <ClaimRewards
                closeModal={setDisplayModal3}
                displayModal={displayModal3}
                contract={contract}
                address={address}
            />
        </>
    )
}
