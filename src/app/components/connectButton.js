"use client"; // This is a client components

import { useEffect, useState } from "react";

export default function Connect({ isConnected }) {
  const [metaMask, changeMetamask] = useState(0); // 0 connect to metamask, 1 connected, 2 download metamask

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      await ethereum.request({ method: "eth_requestAccounts" });
      changeMetamask(1);
      isConnected(true);
    } else {
      changeMetamask(2);
    }
  };

  return (
    <button
      className="text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
      onClick={connect}
    >
      {metaMask == 0 ? (
        <p>Connect to metamask</p>
      ) : metaMask == 1 ? (
        <p>Connected</p>
      ) : (
        <p>install Metamask</p>
      )}
    </button>
  );
}
