"use client"

import Image from "next/image";
import { Montserrat } from "next/font/google";
import Connect from "../../components/connectButton";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

export default function poolPage() {
  const [connected, isConnected] = useState(false);

  function numberCounter() {
    let countingY = 0
    let countingL = 0

    const totalYield = 670
    const liquidities = 23430

    let counter = setInterval(count, 1)

    function count() {
      const matches = document.querySelectorAll('.number')

      if(countingY + 100 <= totalYield) {
        countingY += 100
        matches[0].innerHTML = countingY
      } else {
        countingY = totalYield
        matches[0].innerHTML = countingY
      }

      if(countingL + 100 <= liquidities) {
        countingL += 100
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

  useEffect(() => {
    numberCounter()
  }, [])

  return ( <div className={monserrat.className}>
      <header className="justify-between flex flex-row items-center p-6">
        <div className="relative">
          <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
        </div>
        <div>
          <Link
            href="/"
            className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
          >
            EXCHANGE
          </Link>
          <Connect isConnected={isConnected}></Connect>
        </div>
      </header>
      <main className="flex flex-col">
        <section className="flex flex-row text-gray-400 justify-evenly px-28 mt-16">
            <div  className="flex flex-col text-center mt-16 space-y-1">
              <p className="text-xl">YIELD DISTRIBUTED</p>
              <p className="text-lg number">0</p>
            </div>
            <div className="flex flex-col text-center">
              <p className="text-sm">LIQUIDITY POOL</p>
              <p className="text-3xl">USDT/BTC</p>
              <p className="text-lg mt-2">Price: 21234</p>
            </div>
            <div className="flex flex-col text-center mt-16 space-y-1">
              <p className="text-xl">TOTAL LIQUIDITY</p>
              <p className="text-lg number">0</p>
            </div>
        </section>
        <section className="flex flex-col text-gray-400 place-items-center mt-24 space-y-10">
          <p className="text-center text-2xl">Your contributions:</p>
          <div className="flex flex-row items-center">
            <p className="text-lg">Amount provided: <span>1928</span></p>
            <button className="border-2 border-gray-400 button rounded-xl p-2">Add liquidity</button>
          </div>
          <div className="flex flex-row items-center">
            <p className="text-lg">Yield earned: <span>1234412</span></p>
            <button className="border-2 border-gray-400 button rounded-xl p-2">Get yield</button>
          </div>
        </section>
      </main>
    </div> 
  );
}
