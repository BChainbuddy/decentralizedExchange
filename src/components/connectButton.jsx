"use client"; // This is a client components

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Connect({ setConnected }) {
  const [metaMask, changeMetamask] = useState(0); // 0 connect to metamask, 1 connected, 2 download metamask
  const [account, setAccount] = useState("");

  //Button
  const [isActive, setActive] = useState(true)

  const toggleWords = () => {
    if(isActive){
      setActive(false)
    } else {
      setActive(true)
    }
  }

  const { connect, connectors } = useConnect();
  const { address } = useAccount()
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!isConnected) {
      setConnected(false);
      changeMetamask(0)
      setActive(true)
    } else {
      setConnected(true);
      changeMetamask(1)
      prettyAddress(address)
    }
  }, []);

  const prettyAddress = (user) => {
    const prettyUser =
      user.substring(0, 8).toString() +
      "..." +
      user.substring(user.length - 3).toString();
    setAccount(prettyUser);
  }

  const isMetamaskAvailable = () => {
    if (typeof window.ethereum === "undefined") {
      changeMetamask(2);
    }
  };



  return (
  <section className="">
    {metaMask === 0 ? (
      <>
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => {
              connect({ connector })
              changeMetamask(1)
              }
            }
            className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300"
          >
            CONNECT WALLET
          </button>
        ))}
      </>
    ) : (
      <button 
        className="button text-gray-400 mr-10 border rounded-md py-3 w-36 hover:bg-zinc-300"
        onClick={disconnect}
        id="disconnectButton"
        onMouseEnter={toggleWords}
        onMouseLeave={toggleWords}
      >
          <span className={isActive ? '' : 'hidden'}>{account}</span><span className={isActive ? 'hidden' : ''}>DISCONNECT</span>
      </button>
    )} 
  </section>
  );
}

// TO IMPLEMENT IF METAMASK ISNT AVAILABLE
// {metaMask === 1 ? (
//   <button className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300">
//     {account}
//   </button>
// ) : (
//   <button className="button text-gray-400 mr-10 border rounded-md p-3 hover:bg-zinc-300">
//     Download Metamask
//   </button>
// )
// }