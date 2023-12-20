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

  const [yieldDistributed, setYieldDistributed] = useState(0)
  const [totalLiquidity, setTotalLiquidity] = useState(0)
  const [lpTokens, setLpTokens] = useState(0)
  const [userYieldDistributed, setUserYieldDistributed] = useState(0)

  const [amountOfTokenOne, setAmountOfTokenOne] = useState(0)
  const [amountOfTokenTwo, setAmountOfTokenTwo] = useState(0)

  const [addressOne, setAddressOne] = useState(0)
  const [addressTwo, setAddressTwo] = useState(0)
  
  const provider = useProvider()
  const { data: signer } = useSigner()
  const { address, isConnected } = useAccount()

  const contract = useContract({
    address: "0xe86Bf06c275C51A6286254175575d0Bea8f87fCb",
    abi: ABI,
    signerOrProvider: signer || provider,
  });

  const getPoolStats = async () => {
    const yielded = await contract.yieldAmount()
    const liquidity = await contract.getLiquidity()
    const tokens = await contract.getLpTokenQuantity(address)
    const useryielded = await contract.yieldTaken(address)
    const addressOne = await contract.assetOneAddress()
    const addressTwo = await contract.assetTwoAddress()
    // console.log(yielded.toString())
    // console.log(liquidity.toString())
    // console.log(tokens.toString())
    // console.log(useryielded.toString())
    setYieldDistributed(yielded)
    setTotalLiquidity(liquidity/10**36)
    setLpTokens(tokens)
    setUserYieldDistributed(useryielded)
    setAddressOne(addressOne)
    setAddressTwo(addressTwo)
  }

  const getAmountOfTokenNeeded = async (a) => {
    if(a > 1){
      setAmountOfTokenOne(a)
      console.log(`This is the amout of output ${ethers.utils.parseEther(a).toString()}`)
      console.log(`This is address one ${addressOne.toString()}`)
      // NEED TO ADD APROVE
      const amountNeeded = await contract.amountOfOppositeTokenNeeded(addressOne.toString() , ethers.utils.parseEther(a).toString())
      setAmountOfTokenTwo(amountNeeded)
    }
  }

  function numberCounter() {
    let countingY = 0
    let countingL = 0

    const totalYield = 50000
    const liquidities = totalLiquidity

    let counter = setInterval(count, 1)

    function count() {
      const matches = document.querySelectorAll('.number')
      if(matches.length > 0) {
        if(countingY + 100 <= totalYield) {
          countingY += 100
          matches[0].innerHTML = countingY
        } else {
          countingY = totalYield
          matches[0].innerHTML = countingY
        }
  
        if(countingL + 1000 <= liquidities) {
          countingL += 1000
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

  useEffect(() => {
    setConnected(false)
  }, [])

  useEffect(() => {
    if(isConnected){
      getPoolStats()
    }
  }, [isConnected])

  useEffect(() => {
    if(totalLiquidity > 0){
      numberCounter()
      console.log(totalLiquidity.toString())
    }
  }, [totalLiquidity])

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
            <div  className="flex flex-col text-center mt-16 space-y-1 w-1/3 ml-8">
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
              <p className="text-3xl text-cyan-500">USDT/BTC</p>
              <p className="text-lg mt-2">Price: 21234</p>
            </div>
            <div className="flex flex-col text-center mt-16 space-y-1 w-1/3 mr-8">
              <div className="flex flex-row items-center justify-center space-x-1">
                <p className="text-xl">TOTAL LIQUIDITY</p><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mb-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
              </div>
              <p className="text-lg number">0</p>
            </div>
        </section>
        <section className="flex flex-col text-white/75 place-items-center shadow-xl shadow-slate-800/90 mt-24 space-y-16  w-5/12 mx-auto py-8 px-2 rounded-xl bg-gray-700 border-8 border-gray-600">
          <p className="text-center text-2xl text-white">YOUR CONTRIBUTIONS:</p>
          <div className="flex flex-row items-center w-full">
            <div className="w-1/2 text-center">
              <p className="text-lg">LIQUIDITY PROVIDED</p>
              <p className="text-base">0</p>
            </div>
            <div className="flex justify-center w-1/2">
              <button onClick={() => {
                setDisplayModal(true)
              }} className="transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700">Add liquidity</button>
            </div>
          </div>
          <div className="flex flex-row items-center w-full">
            <div className="w-1/2 text-center">
              <p className="text-lg">YIELD EARNED</p>
              <p className="text-base">0</p>
            </div>
            <div className="flex justify-center w-1/2">
              <button onClick={() => {
                setDisplayModal2(true)
              }} className="transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700">Get yield</button>
            </div>
          </div>
        </section>
      </main>
      <Modal isVisible={displayModal} onClose={() => {
        setDisplayModal(false)
      }}>
        <p className="text-center text-white text-2xl">INVEST INTO <span className="text-cyan-300">BTC/USDT</span> LIQUIDITY POOL</p>
        <div className="mx-auto mt-10">
          <p className="text-white text-lg">Input base token</p>
          <div className="flex flex-row space-x-2">
            <input onChange={(e) => {getAmountOfTokenNeeded(e.target.value)}} placeholder="0.00" type="number" min="0" step="0.1"/>
            <p className="text-white text-xl w-12 text-center">BTC</p> 
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FFFFFF" className="w-6 h-6 mx-auto mt-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        <div className="mx-auto mt-3">
          <p className="text-white text-lg">Input base token</p>
          <div className="flex flex-row space-x-2">
            <input placeholder={amountOfTokenTwo !== 0 ? amountOfTokenTwo : 0.00} min="0" disabled></input>
            <p className="text-white text-xl w-12 text-center">USDT</p>
          </div>
        </div>
        <p className="text-center mt-7 text-white text-lg">
          Invest to start earning <span className="text-cyan-300">rewards</span> from the pool TODAY!
        </p>
      </Modal>
      <Modal isVisible={displayModal2} onClose={() => {
        setDisplayModal2(false)
      }}>
        <p className="text-center text-white text-2xl">CLAIM THE <span className="text-cyan-300">REWARDS</span></p>
        <div className="mx-auto text-white mt-10">
          <p className="text-center text-xl">Unrealized rewards:</p>
          <p className="text-center text-lg mt-0.5">124312412</p>
        </div>
        <button className="mt-12 mx-auto transition ease-in-out duration-500 border bg-cyan-500 rounded-xl p-2 text-white hover:scale-110 hover:bg-cyan-700">
          CLAIM REWARDS
        </button>
        <div className="mx-auto text-white mt-12">
          <p className="text-center text-xl">Realized rewards:</p>
          <p className="text-center text-lg mt-0.5">12412135</p>
        </div>
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