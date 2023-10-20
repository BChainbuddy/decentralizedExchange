"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import Input from "./components/input";
import Output from "./components/output";
import Swap from "./components/swap";
import Connect from "./components/connectButton";
import { useState } from "react";

const monserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [connected, isConnected] = useState(false);
  const [chosenTokenInput, chooseTokenInput] = useState("Symbol");
  const [chosenTokenOutput, chooseTokenOutput] = useState("Symbol");

  return (
    <div className={monserrat.className}>
      <header className="justify-between flex flex-row items-center p-6">
        <div className="relative">
          <p className="text-gray-400 text-4xl font-bold">SEA SWAP</p>
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-500 shadow shadow-cyan-500"></div>
        </div>
        <Connect isConnected={isConnected}></Connect>
      </header>
      <main className="flex justify-center">
        <div className="space-y-2 mt-24 py-10 text-gray-400 w-fit p-10 text-center flex flex-col rounded-xl shadow-2xl shadow-cyan-400">
          <p className="text-2xl mb-4">Exchange Tokens</p>
          <div className="flex flex-col">
            <div>
              <p className="ml-2 text-left">Input</p>
            </div>
            <Input
              chooseTokenInput={chooseTokenInput}
              chosenTokenInput={chosenTokenInput}
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
            ></Output>
          </div>
          <Swap>
            chosenTokenInput={chosenTokenInput}
            chosenTokenOutput={chosenTokenOutput}
          </Swap>
        </div>
      </main>
    </div>
  );
}
