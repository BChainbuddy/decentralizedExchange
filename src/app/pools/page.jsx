"use client"

import Image from "next/image";
import { Montserrat } from "next/font/google";
import Input from "../../components/input";
import Output from "../../components/output";
import Swap from "../../components/swap";
import Connect from "../../components/connectButton";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation"

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

export default function liquidityPools() {
  const [connected, isConnected] = useState(false);

  return ( <div className={monserrat.className}>
      <header className="justify-between flex flex-row items-center p-6">
        <div className="relative">
          <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
        </div>
        <div>
          <Link
            href="/"
            className="text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
          >
            EXCHANGE
          </Link>
          <Connect isConnected={isConnected}></Connect>
        </div>
      </header>
      <div className="flex flex-col text-gray-400 place-items-center">
        <h1>CONTRIBUTED TO</h1>
      </div>
      <div className="flex flex-col text-gray-400 place-items-center">
        <h1>TOP LIQUIDITY POOLS</h1>
      </div>
      <div className="flex flex-col text-gray-400 place-items-center">
        <h1>Want to start a liquidity pool?</h1>
        <button>CREATE POOL</button>
      </div>

    </div> 
  );
}
