"use client"

import Image from "next/image";
import { Montserrat } from "next/font/google";
import Connect from "../../components/connectButton";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Modal from "../../components/modal"
import CONTRACT_ADDRESS from "../../constants/LiquidityPoolAddress.json"
import ABI from "../../constants/LiquidityPoolAbi.json"
import ERC20ABI from "../../constants/ERC20abi.json"
import { useContract, useProvider, useSigner, useAccount } from "wagmi";
import { ethers } from "ethers"

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

export default function poolPage() {
  const [connected, setConnected] = useState(false);
  const [displayModal, setDisplayModal] = useState(false)
  const [displayModal2, setDisplayModal2] = useState(false)
  const [displayModal3, setDisplayModal3] = useState(false)

  const [yieldDistributed, setYieldDistributed] = useState(0)
  const [totalLiquidity, setTotalLiquidity] = useState(0)
  const [userLpTokens, setUserLpTokens] = useState()
  const [userYieldDistributed, setUserYieldDistributed] = useState(0)
  const [price, setPrice] = useState(0)

  const [amountOfTokenOne, setAmountOfTokenOne] = useState(0)
  const [amountOfTokenTwo, setAmountOfTokenTwo] = useState(0)

  const [addressOne, setAddressOne] = useState(0)
  const [addressTwo, setAddressTwo] = useState(0)
  const [symbolOne, setSymbolOne] = useState("Loading...")
  const [symbolTwo, setSymbolTwo] = useState("Loading...")

  const [timeLeft, setTimeLeft] = useState(0)

  const [removeLiquidity, setRemoveLiquidity] = useState(0)
  
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address, isConnected } = useAccount()

  const liquidityPoolAddres = CONTRACT_ADDRESS["11155111"][0]

  // Retrieving the contract objects with wagmi
  const contract = useContract({
    address: liquidityPoolAddres.toString(),
    abi: ABI,
    signerOrProvider: signer || provider,
  });

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

  const getPoolStats = async () => {
    // Getting the contract storage variables
    const yielded = await contract.yieldAmount()
    const liquidity = await contract.getLiquidity()
    const tokens = await contract.getLpTokenQuantity(address)
    const useryielded = await contract.yieldTaken(address)
    const addressOne = await contract.assetOneAddress()
    const addressTwo = await contract.assetTwoAddress()
    const price = await contract.assetOnePrice()

    console.log(liquidityPoolAddres)
    console.log(price.toString())
    
    // Updating the state variables
    setYieldDistributed(yielded/10**18)
    setTotalLiquidity(Math.floor(liquidity/10**36))
    setUserLpTokens(tokens/10**36)
    setUserYieldDistributed(useryielded/10**18)
    setAddressOne(addressOne)
    setAddressTwo(addressTwo)
    setPrice((price/10**18).toFixed(2))
    // Logging the contract storage variables to check if correct
    // console.log(yielded.toString())
    // console.log(liquidity.toString())
    // console.log(tokens.toString())
    // console.log(useryielded.toString())
  }

  const getSymbols = async () => {
    const getSymbolOne = await contractERC20first.symbol()
    const getSymbolTwo = await contractERC20second.symbol()

    setSymbolOne(getSymbolOne.toString())
    setSymbolTwo(getSymbolTwo.toString())
  }

  useEffect(() => {
    if(addressTwo !== 0){
      getSymbols()
    }

  }, [addressTwo])

  const getAmountOfTokenNeeded = async (a) => {
    if(a > 0){
      setAmountOfTokenOne(a)
      console.log(`This is the amout of input ${ethers.utils.parseEther(a).toString()}`)
      const amountNeeded = await contract.amountOfOppositeTokenNeeded(addressOne.toString(), ethers.utils.parseEther(a))
      console.log(`This is the amout of input ${amountNeeded.toString()}`)
      setAmountOfTokenTwo(ethers.utils.formatEther(amountNeeded))
    }
  }

  const addLiquidity = async () => {
    console.log(`Amount of token one ${(amountOfTokenOne*1.1).toString()}`)
    console.log(`Amount of token two ${(amountOfTokenTwo*1.1).toString()}`)
    await contractERC20first.approve(liquidityPoolAddres, ethers.utils.parseEther((amountOfTokenOne*1.1).toString()))
    await contractERC20second.approve(liquidityPoolAddres, ethers.utils.parseEther((amountOfTokenTwo*1.1).toString()))
    await contract.addLiquidity(addressOne, addressTwo, ethers.utils.parseEther(amountOfTokenOne))
  }

  const removePartLiquidty = async () => {
    if(removeLiquidity > 0 && removeLiquidity <= 100) {
      console.log(`Removing ${Math.round(removeLiquidity)} liqudity...`)
      await contract.removeLiquidity(Math.round(removeLiquidity))
      console.log(`Liquidty removed!`)
    }
  }

  const claimRewards = async () => {
    await contract.getYield()
  }

  function numberCounter() {
    let countingY = 0
    let countingL = 0

    const totalYield = yieldDistributed
    const liquidities = totalLiquidity

    const div1 = totalYield/1000
    const div2 = liquidities/1000

    let counter = setInterval(count, 1)

    function count() {
      const matches = document.querySelectorAll('.number')
      if(matches.length > 0) {
        if(countingY + div1 <= totalYield) {
          countingY += div1
          matches[0].innerHTML = countingY.toFixed(5)
        } else {
          countingY = totalYield
          matches[0].innerHTML = countingY.toFixed(5)
        }
  
        if(countingL + div2 <= liquidities) {
          countingL += div2
          matches[1].innerHTML = countingL
        } else {
          countingL = liquidities
          matches[1].innerHTML = countingL
        }
  
        if (totalYield === countingY && liquidities === countingL) {
          clearInterval(counter);
          console.log("The interval is closed")
        }
      }
    }
  }

  const resetStats = () => {
    setYieldDistributed(0)
    setTotalLiquidity(0)
    setUserLpTokens(0)
    setUserYieldDistributed(0)
    setPrice(0)
    
    setAmountOfTokenOne(0)
    setAmountOfTokenTwo(0)

    setAddressOne(0)
    setAddressTwo(0)
    setSymbolOne("Loading...")
    setSymbolTwo("Loading...")

    const matches = document.querySelectorAll('.number')
      matches[0].innerHTML = "0"
      matches[1].innerHTML = "0"
  }

  useEffect(() => {
    if(isConnected){
      getPoolStats()
    } else {
      resetStats()
    }
  }, [isConnected])

  useEffect(() => {
    if(symbolTwo !== "Loading..."){
      numberCounter()
    }
  }, [symbolTwo])

  const getTimeLeft = async () => {
    console.log('Get time left...')
    const response = await contract.isTime()
    console.log(response.toString())
    if(!response){
      console.log("TimeLock is on")
      const timestamp = await contract.lastYieldFarmedTime(address)
      const currentTimeStamp = Math.round(Date.now() / 1000)
      const timeLeft = parseInt(timestamp) + 24*60*60 - currentTimeStamp
      console.log(timeLeft)
      setTimeLeft(timeLeft)
      const hoursLeft = Math.floor(timeLeft/60/60)
      console.log(hoursLeft)
      const minutesLeft = (Math.floor(timeLeft/60)) % 24
      console.log(minutesLeft)
      if(document.getElementById("time") !== null){
        document.getElementById("time").innerHTML = `${hoursLeft} H ${minutesLeft} min`
      }
    }
    console.log("TimeLock is not on")

  }
  useEffect(() => {
    if(displayModal2) {
      getTimeLeft()
    }
  }, [displayModal2])

  return ( 
    <div className={monserrat.className}>
      <header className="justify-between flex flex-row items-center p-6">
        <div className="relative">
          <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
        </div>
        <div className="flex flex-row">
          <Link
            href="/"
            className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
          >
            EXCHANGE
          </Link>
          <Connect setConnected={setConnected}></Connect>
        </div>
      </header>
      <main className="flex flex-col">
        <section className="flex flex-row text-gray-400 px-28 mt-16">
            <div  className="flex flex-col text-center mt-16 space-y-1 w-1/3 p-1">
              <div className="flex flex-row items-center justify-center space-x-1">
                <p className="text-xl">YIELD DISTRIBUTED</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mb-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
              </div>
              <p className="text-lg number">0</p>
            </div>
            <div className="flex flex-col text-center w-1/3">
              <p className="text-sm">LIQUIDITY POOL</p>
              <p className={`${symbolTwo === "Loading..." ? "animate-pulse" : "animate-none"} text-3xl text-cyan-500`}>{symbolOne}/{symbolTwo}</p>
              <p className="text-lg mt-2">{price}</p>
            </div>
            <div className="flex flex-col text-center mt-16 space-y-1 w-1/3 p-1">
              <div className="flex flex-row items-center justify-center space-x-1">
                <p className="text-xl">TOTAL LIQUIDITY</p><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <p className="text-lg number">0</p>
            </div>
        </section>
        <section className="mx-auto flex flex-col text-white/75 place-items-center shadow-xl shadow-slate-800/90 hover:shadow-2xl mt-24 space-y-16  w-5/12 py-8 px-2 rounded-xl bg-gray-700 border-8 border-gray-600 pb-10">
          <p className="text-center text-2xl text-white">YOUR CONTRIBUTIONS:</p>
          <div className="flex flex-row items-center w-full">
            <div className="w-1/2 text-center">
              <p className="text-lg">LIQUIDITY PROVIDED</p>
              <div role="status" className={`${symbolTwo === "Loading..." ? "" : "hidden"} flex justify-center mt-1`}>
                  <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
              <p className={`${symbolTwo === "Loading..." ? "hidden" : ""} text-base`}>{Math.floor(userLpTokens).toString()}</p>
            </div>
            <div className="flex justify-center w-1/2">
              <div className="flex flex-col space-y-3">
                <button onClick={() => {
                  setDisplayModal(true)
                }} className="block transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44">Add liquidity</button>
                <button onClick={() => {
                  setDisplayModal3(true)
                }} className="block transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44">Remove liquidity</button>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center w-full">
            <div className="w-1/2 text-center">
              <p className="text-lg">YIELD EARNED</p>
              <div role="status" className={`${symbolTwo === "Loading..." ? "" : "hidden"} flex justify-center mt-1`}>
                  <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-cyan-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
              <p className={`${symbolTwo === "Loading..." ? "hidden" : ""} text-base`}>{userYieldDistributed.toString()}</p>
            </div>
            <div className="flex justify-center w-1/2">
              <button onClick={() => {
                setDisplayModal2(true)
              }} className="transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700 w-44">Get yield</button>
            </div>
          </div>
        </section>
      </main>
      <Modal isVisible={displayModal} onClose={() => {
        setDisplayModal(false)
        setAmountOfTokenOne(0)
        setAmountOfTokenTwo(0)
      }}>
        <p className="text-center text-white text-2xl">INVEST INTO <span className="text-cyan-300">{symbolOne}/{symbolTwo}</span> LIQUIDITY POOL</p>
        <div className="mx-auto mt-10">
          <p className="text-white text-lg">Input base token</p>
          <div className="flex flex-row space-x-2">
            <input onChange={(e) => {getAmountOfTokenNeeded(e.target.value)}} placeholder="0.00" type="number" min="0" step="0.1" className="pl-1 rounded"/>
            <p className="text-white text-xl w-12 text-center">{symbolOne}</p> 
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" className="w-6 h-6 mx-auto mt-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        <div className="mx-auto mt-3">
          <p className="text-white text-lg">Input base token</p>
          <div className="flex flex-row space-x-2">
            <input placeholder={amountOfTokenTwo !== 0 ? amountOfTokenTwo : "0.00"} min="0" disabled className="pl-1 rounded"></input>
            <p className="text-white text-xl w-12 text-center">{symbolTwo}</p>
          </div>
        </div>
        <button className="mt-6 mx-auto transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700"
        onClick={() => {
          addLiquidity()
        }}
        disabled={amountOfTokenTwo > 0 ? false : true}
        >
          ADD LIQUIDITY
        </button>
        <p className="text-center mt-7 text-white text-lg">
          Invest to start earning <span className="text-cyan-300">rewards</span> from the pool TODAY!
        </p>
      </Modal>
      <Modal isVisible={displayModal2} onClose={() => {
        setDisplayModal2(false)
      }}>
        <p className="text-center text-white text-2xl">CLAIM THE <span className="text-cyan-300">REWARDS</span></p>
        <button className="mt-8 mx-auto transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700"
          onClick={() => {
            claimRewards()
          }}
          disabled={timeLeft === 0 ? false : true}
        >
          CLAIM REWARDS
        </button>
        <div className="mx-auto mt-8">
          <p className="text-white"><span className={timeLeft === 0 ? "flex" : "hidden"}>The rewards are available to claim</span><span className={timeLeft === 0 ? "hidden" : "flex"}>You have to wait for <span id="time" className="ml-1 text-cyan-300"> </span> !</span></p>
        </div>
      </Modal>
      <Modal isVisible={displayModal3} onClose={() => {
        setDisplayModal3(false)
        setRemoveLiquidity(0)
      }}>
        <p className="text-center text-white text-2xl"><span className="text-cyan-300">REMOVE</span> THE LIQUIDITY</p>
        <div className="mt-8 mx-auto">
          <input onChange={(e) => {setRemoveLiquidity(e.target.value)}} placeholder="0" type="number" min="0" step="1" className="pl-1 rounded"/>
        </div>
        <button onClick={() => {removePartLiquidty()}} disabled={removeLiquidity === 0 ? true : false}
        className="mt-8 mx-auto transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700"
        >
          REMOVE LIQUIDITY
        </button>
        <p className="text-white text-center mt-6">Input a <span className="text-cyan-300">percent</span> of liquidity you want to remove</p>
      </Modal>
    </div> 
  );
}



/* 
Add liquidity, first input on change triggers function function amountOfOppositeTokenNeeded(address _asset,  uint256 _amount)
second input will show the output of this function function amountOfOppositeTokenNeeded(address _asset,  uint256 _amount)
we can get token contracts like this     address assetOneAddress address assetTwoAddress;
first one needs to be assetOneAddress, then they can change with arrows
*/