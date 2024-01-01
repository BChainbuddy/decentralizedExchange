import CONTRACT_ADDRESS from "../constants/LiquidityPoolAddress.json"
import ABI from "../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../constants/ERC20abi.json"
import { useContract, useProvider, useSigner, useAccount } from "wagmi"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

export default function SwapTest({
    chosenTokenAddressInputTest,
    chosenTokenAddressOutputTest,
    chosenTokenDecimalsOutputTest,
    chosenTokenDecimalsInputTest,
    inputAmountTest,
    outputAmountTest
}) {
    // Wagmi functions
    const provider = useProvider()
    const { data: signer } = useSigner()
    const { address, isConnected } = useAccount()

    const [addressOne, setAddressOne] = useState(0)
    const [addressTwo, setAddressTwo] = useState(0)

    const liquidityPoolAddress = CONTRACT_ADDRESS["11155111"][0]

    // Retrieving the contract objects with wagmi
    const contract = useContract({
        address: liquidityPoolAddress.toString(),
        abi: ABI,
        signerOrProvider: signer || provider
    })

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

    async function getAddress() {
        const addressOne1 = await contract.assetOneAddress()
        const addressTwo2 = await contract.assetTwoAddress()
        setAddressOne(addressOne1)
        setAddressTwo(addressTwo2)
    }

    useEffect(() => {
        if (isConnected) {
            getAddress()
        }
    }, [isConnected])

    async function swap() {
        console.log("SWAP")
        const addressOne = await contract.assetOneAddress()
        const swapFee = await contract.swapFee()
        if (chosenTokenAddressInputTest === chosenTokenAddressOutputTest) {
            console.log("Cant trade same tokens!")
            return
        } else if (addressOne === chosenTokenAddressInputTest) {
            try {
                console.log("Selling asset one!")
                await contractERC20first.approve(
                    liquidityPoolAddress,
                    ethers.utils.parseEther((inputAmountTest * 2).toString())
                )
                const tx = await contract.sellAssetOne(inputAmountTest, {
                    value: swapFee
                })
                const receipt = await tx.wait(1)
                if (receipt.status === 1) {
                    console.log("Transaction successful!")
                }
            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                console.log("Selling asset two!")
                await contractERC20second.approve(
                    liquidityPoolAddress,
                    ethers.utils.parseEther((inputAmountTest * 2).toString())
                )
                const tx = await contract.sellAssetTwo(inputAmountTest, {
                    value: swapFee
                })

                const receipt = await tx.wait(1)
                if (receipt.status === 1) {
                    console.log("Transaction successful!")
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <div>
            <button
                className="border-2 rounded-lg py-2 px-16 mt-6 hover:bg-zinc-300"
                onClick={swap}
                disabled={outputAmountTest === 0 ? true : false}
            >
                SWAP
            </button>
        </div>
    )
}
