"use client"; // This is a client components

import { useEffect, useState } from "react";

export default function Connect({ isConnected }) {
  const [metaMask, changeMetamask] = useState(0); // 0 connect to metamask, 1 connected, 2 download metamask
  const [account, setAccount] = useState("");

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      await ethereum.request({ method: "eth_requestAccounts" });
      let accounts = await ethereum.request({ method: "eth_accounts" });
      let user = accounts[0];
      const prettyUser =
        user.substring(0, 8).toString() +
        "..." +
        user.substring(user.length - 3).toString();
      setAccount(prettyUser);
      changeMetamask(1);
      isConnected(true);
    } else {
      changeMetamask(2);
    }
  };

  return (
    <button
      className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
      onClick={connect}
    >
      {metaMask == 0 ? (
        <p>Connect to metamask</p>
      ) : metaMask == 1 ? (
        <p>{account}</p>
      ) : (
        <p>Download metamask</p>
      )}
    </button>
  );
}
