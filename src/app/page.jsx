"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import Input from "../components/input";
import Output from "../components/output";
import Swap from "../components/swap";
import Connect from "../components/connectButton";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [connected, isConnected] = useState(false);
  const [chosenTokenInput, chooseTokenInput] = useState("Symbol");
  const [chosenTokenOutput, chooseTokenOutput] = useState("Symbol");
  const [chosenTokenAddressInput, chooseTokenAddressInput] = useState(0);
  const [chosenTokenAddressOutput, chooseTokenAddressOutput] = useState(0);
  const [chosenTokenDecimalsInput, chooseTokenDecimalsInput] = useState(0);
  const [chosenTokenDecimalsOutput, chooseTokenDecimalsOutput] = useState(0);
  const [amountOutput, changeAmountOutput] = useState(0);
  const [inputAmount, setInputAmount] = useState(0);

  return (
    <div className={monserrat.className}>
      <header className="justify-between flex flex-row items-center p-6">
        <div className="relative">
          <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
        </div>
        <div>
          <Link
            href='/poolpage'
            className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
          >
            LIQUIDITY POOL
          </Link>
          <Connect isConnected={isConnected}></Connect>
        </div>
      </header>
      <main className="flex justify-center">
        <div className="w-[450px] space-y-1 mt-16 py-10 text-gray-400 p-10 text-center flex flex-col rounded-xl shadow-2xl shadow-cyan-400">
          <p className="text-2xl mb-4">Exchange Tokens</p>
          <div className="flex flex-col">
            <div>
              <p className="ml-2 text-left">Input</p>
            </div>
            <Input
              chooseTokenInput={chooseTokenInput}
              chosenTokenInput={chosenTokenInput}
              chooseTokenAddressInput={chooseTokenAddressInput}
              chooseTokenDecimalsInput={chooseTokenDecimalsInput}
              setInputAmount={setInputAmount}
            ></Input>
          </div>
          <div className="flex justify-center">
            <Image
              src="/arrowDownLong.svg"
              alt="arrow"
              width={50}
              height={50}
              className="mt-3"
            ></Image>
          </div>
          <div>
            <div>
              <p className="ml-2 text-left">Output</p>
            </div>
            <Output
              chooseTokenOutput={chooseTokenOutput}
              chosenTokenOutput={chosenTokenOutput}
              chosenTokenAddressInput={chosenTokenAddressInput}
              chooseTokenAddressOutput={chooseTokenAddressOutput}
              chosenTokenAddressOutput={chosenTokenAddressOutput}
              chosenTokenDecimalsInput={chosenTokenDecimalsInput}
              chooseTokenDecimalsOutput={chooseTokenDecimalsOutput}
              chosenTokenDecimalsOutput={chosenTokenDecimalsOutput}
              changeAmountOutput={changeAmountOutput}
              inputAmount={inputAmount}
              amountOutput={amountOutput}
            ></Output>
          </div>
          <Swap
            chosenTokenAddressInput={chosenTokenAddressInput}
            chosenTokenAddressOutput={chosenTokenAddressOutput}
            chosenTokenDecimalsInput={chosenTokenDecimalsInput}
            chosenTokenDecimalsOutput={chosenTokenDecimalsOutput}
            inputAmount={inputAmount}
            connected={connected}
          ></Swap>
        </div>
      </main>
    </div>
  );
}
