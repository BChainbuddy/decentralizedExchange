import CONTRACT_ADDRESS from "../constants/LiquidityPoolAddress.json"
import ABI from "../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../constants/ERC20abi.json"
import { useContract, useProvider, useSigner, useAccount } from "wagmi"
import { ethers } from "ethers"
import { useState, useEffect } from "react"

export default function InputTestnet({
    chosenTokenInputTest,
    chooseTokenInputTest,
    chosenTokenAddressInputTest,
    chooseTokenAddressInputTest,
    chooseTokenDecimalsInputTest,
    setInputAmountTest,
    isMainnet
}) {
    const [modal, showModal] = useState(false)
    const [tokens, setTokens] = useState([])
    const [inputText, setInputText] = useState("")

    // Token contracts
    const [addressOne, setAddressOne] = useState(0)
    const [addressTwo, setAddressTwo] = useState(0)

    // Wagmi functions
    const provider = useProvider()
    const { data: signer } = useSigner()
    const { address, isConnected } = useAccount()

    const openModal = () => {
        showModal(true)
    }

    const closeModal = () => {
        showModal(false)
    }

    function willChooseToken(symbol, address, decimals) {
        console.log(`This is the chosen token symbol ${symbol}`)
        console.log(`This is the chosen token address ${address}`)
        console.log(`This is the chosen token decimals ${decimals}`)
        chooseTokenInputTest(symbol)
        chooseTokenAddressInputTest(address)
        chooseTokenDecimalsInputTest(decimals)
        closeModal()
    }

    function shortenSymbol(longSymbol) {
        const newSymbol = longSymbol.substring(0, 5).toString() + ".."
        return newSymbol
    }

    const handleClose = e => {
        if (e.target.id === "wrapper") {
            closeModal()
            setInputText("")
        }
    }

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

    // This needs to return the tokens that are available on liquidity pool
    async function tokenListInit() {
        try {
            const symbolOne = await contractERC20first.symbol()
            const decimalsOne = await contractERC20first.decimals()
            const symbolTwo = await contractERC20second.symbol()
            const decimalsTwo = await contractERC20second.decimals()
            const allTokens = [
                {
                    address: addressOne,
                    symbol: symbolOne.toString(),
                    decimals: decimalsOne.toString()
                },
                {
                    address: addressTwo,
                    symbol: symbolTwo.toString(),
                    decimals: decimalsTwo.toString()
                }
            ]
            setTokens(allTokens)
            setFilteredTokens(allTokens)
        } catch (error) {
            console.error("An error occurred in tokenListInit:", error)
        }
    }

    const [filteredTokens, setFilteredTokens] = useState([])

    function filterTokenList() {
        const filterTokens =
            inputText !== ""
                ? tokens.filter(token =>
                      token.symbol.toLowerCase().includes(inputText.toLowerCase())
                  )
                : tokens
        setFilteredTokens(filterTokens)
    }

    useEffect(() => {
        if (addressOne !== 0) {
            tokenListInit()
        }
    }, [addressTwo])

    useEffect(() => {
        if (inputText !== "") {
            filterTokenList()
        } else {
            filterTokenList(tokens)
        }
    }, [inputText])

    return (
        <div>
            <div className="flex flex-row p-1">
                <input
                    className="bg-slate-300 rounded-l-md border-2 p-2 text-gray-600"
                    type="number"
                    id="Amount"
                    name="Amount"
                    step="0.1"
                    placeholder="100"
                    min="0"
                    onChange={e => setInputAmountTest(e.target.value)}
                ></input>
                <button
                    className="transition ease-in-out duration-250 border-2 rounded-r-md px-3 hover:bg-zinc-300 hover:text-gray-600"
                    onClick={openModal}
                >
                    {chosenTokenInputTest.length > 6
                        ? shortenSymbol(chosenTokenInputTest)
                        : chosenTokenInputTest}
                </button>
            </div>
            {modal ? (
                <div
                    className="fixed inset-0 bg-opacity backdrop-blur-sm flex justify-center items-center"
                    id="wrapper"
                    onClick={handleClose}
                >
                    <div className="w-[300px] flex flex-col">
                        <button className="text-white text-xl place-self-end" onClick={closeModal}>
                            X
                        </button>
                        <input
                            className="bg-slate-300 rounded-t-md p-2 text-gray-600"
                            type="text"
                            placeholder="Search symbol..."
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                        ></input>
                        <div
                            id="tokenList"
                            className="bg-amber-50 rounded text-center text-black flex flex-col overflow-y-auto h-80"
                        >
                            {filteredTokens.map((token, index) => (
                                <button
                                    className="hover-bg-zinc-300 flex justify-center items-center border border-gray-600 py-2 space-x-1"
                                    key={`${token.symbol}-${index}`}
                                    onClick={() => {
                                        willChooseToken(
                                            token.symbol,
                                            token.address,
                                            token.decimals
                                        )
                                    }}
                                >
                                    <span className="">{token.symbol}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}
