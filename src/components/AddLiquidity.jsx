import { useEffect, useState } from "react"
import Modal from "./Modal"
import { ethers } from "ethers"
import ERC20ABI from "./../constants/ERC20abi.json"
import { useContract, useProvider, useSigner } from "wagmi"
import CONTRACT_ADDRESS from "./../constants/LiquidityPoolAddress.json"

export default function AddLiquidity({
    displayModal,
    closeModal,
    contract,
    symbolOne,
    symbolTwo,
    addressOne,
    addressTwo
}) {
    const [amountOfTokenOne, setAmountOfTokenOne] = useState(0)
    const [amountOfTokenTwo, setAmountOfTokenTwo] = useState(0)
    const [symbolOneAddLiquidity, setSymbolOneAddLiquidity] = useState(null) // Symbols which are only on the modal, for switch purposes
    const [symbolTwoAddLiquidity, setSymbolTwoAddLiquidity] = useState(null)

    const provider = useProvider()
    const { data: signer } = useSigner()
    const liquidityPoolAddress = CONTRACT_ADDRESS["11155111"][0]

    const contractERC20first = useContract({
        address: addressOne.toString(),
        abi: ERC20ABI,
        signerOrProvider: signer || provider
    })

    const contractERC20second = useContract({
        address: addressTwo.toString(),
        abi: ERC20ABI,
        signerOrProvider: signer || provider
    })

    // Calls a smart contract function to add liquidity to the pool, called in add liqudity modal
    const addLiquidity = async () => {
        // console.log(`Amount of token one ${(amountOfTokenOne * 1.1).toString()}`)
        // console.log(`Amount of token two ${(amountOfTokenTwo * 1.1).toString()}`)
        const approvalTx1 = await contractERC20first.approve(
            liquidityPoolAddress,
            ethers.utils.parseEther((amountOfTokenOne * 2).toString())
        )
        const approvalTx2 = await contractERC20second.approve(
            liquidityPoolAddress,
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
        // console.log(txreceipt)
        // console.log(txreceipt.status)
        if (txreceipt.status === 1) {
            console.log(`Liquidity added!`)
            // getPoolStats()
        }
    }

    // Calls a smart contract function to calculate opposite token amount, called in add liquidity modal
    const getAmountOfTokenNeeded = async a => {
        if (a > 0) {
            setAmountOfTokenOne(a)
            // console.log(`This is the amout of input ${ethers.utils.parseEther(a).toString()}`)
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
            // console.log(`This is the amout of input ${amountNeeded.toString()}`)
            setAmountOfTokenTwo(ethers.utils.formatEther(amountNeeded))
        }
    }

    const switchStats = () => {
        const x = symbolOneAddLiquidity
        const y = symbolTwoAddLiquidity

        setAmountOfTokenOne(0)
        setAmountOfTokenTwo(0)
        setSymbolOneAddLiquidity(y)
        setSymbolTwoAddLiquidity(x)
    }

    useEffect(() => {
        if (symbolTwo !== "Loading...") {
            console.log(symbolOne)
            console.log(symbolTwo)
            setSymbolOneAddLiquidity(symbolOne)
            setSymbolTwoAddLiquidity(symbolTwo)
        }
    }, [symbolTwo])

    return (
        <Modal
            isVisible={displayModal}
            onClose={() => {
                closeModal(false)
                setAmountOfTokenOne(0)
                setAmountOfTokenTwo(0)
                setSymbolOneAddLiquidity(symbolOne)
                setSymbolTwoAddLiquidity(symbolTwo)
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
                    <p className="text-white text-xl w-12 text-center">{symbolOneAddLiquidity}</p>
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
                    <p className="text-white text-xl w-12 text-center">{symbolTwoAddLiquidity}</p>
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
    )
}
