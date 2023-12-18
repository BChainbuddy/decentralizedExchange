"use client"

import Image from "next/image";
import { Montserrat } from "next/font/google";
import Input from "../../components/input";
import Output from "../../components/output";
import Swap from "../../components/swap";
import Connect from "../../components/connectButton";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Pool from "../../components/pool";

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

async function getContributions() {
  // GET TOP 3 CONTRBUTIONS STATS IN ARRAY
  let contributions = []
  return contributions
  // THEN POPULATE POOLS IN FOR LOOP OR FOR EACH OF MAP
}

export default function liquidityPools() {
  const [connected, setConnected] = useState(false);

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
      <div className="mt-10">
        <div className="flex flex-col place-items-center space-y-16">
          <h1 className="text-gray-400 text-2xl">CONTRIBUTED TO</h1>
          <div className="flex flex-row">
            <Pool></Pool>
          </div>
        </div>
        <div className="flex flex-col place-items-center">
          <h1 className="text-gray-400 text-xl">TOP LIQUIDITY POOLS</h1>
        </div>
        <div className="flex flex-col place-items-center space-y-3">
          <h1 className="text-gray-400 text-lg">Want to start a liquidity pool?</h1>
          <button className="py-2 px-10 bg-cyan-500 text-slate-900 rounded-3xl">CREATE POOL</button>
        </div>
      </div>
    </div> 
  );
}
