"use client";

import { Web3 } from "web3";
import dotenv from "dotenv";
import qs from "qs";
import BigNumber from "bignumber.js";

dotenv.config();

export default function Swap({
  chosenTokenAddressInput,
  chosenTokenAddressOutput,
  chosenTokenDecimalsOutput,
  chosenTokenDecimalsInput,
  inputAmount,
  connected,
}) {
  async function swapTokens() {
    console.log(`This is the inputToken address ${chosenTokenAddressInput}`);
    console.log(`This is the outputToken address ${chosenTokenAddressOutput}`);
    console.log(`This is the current value of input token ${inputAmount}`);

    //GET THE ACCOUNT AND ERC20 CONTRACT
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let userAddress = accounts[0];
    console.log(`This is the user address ${userAddress}`);
    const web3 = new Web3(window.ethereum);
    const erc20abi = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "uint256", name: "max_supply", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "account", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const ERC20TokenContract = new web3.eth.Contract(
      erc20abi,
      chosenTokenAddressInput
    );

    //GETTING THE QUOTE WITH 0x
    console.log("Getting Quote for swap...");
    const params = {
      sellToken: chosenTokenAddressInput, //NEEDS TO BE AN ADDRESS
      buyToken: chosenTokenAddressOutput, // NEEDS TO BE AN ADDRESS
      sellAmount: Number(inputAmount * 10 ** chosenTokenDecimalsInput), //web3.utils.toWei(inputAmount.toString(), "ether"), //Number(inputAmount * 10 ** chosenTokenDecimalsInput), //NEEDS TO BE * DECIMALS
      userAddress,
    };
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      {
        headers: {
          "0x-api-key": process.env.NEXT_PUBLIC_APIKEY,
        },
      }
    );

    let swapQuoteJSON = await response.json();
    console.log("Price: ", swapQuoteJSON);

    //GETTING QUOTE APPROVA
    // let maxApproval = new BigNumber(2).pow(256).minus(1);
    // const maxApproval = new BigNumber(
    //   "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    // );
    const maxApproval = new BigNumber(100)
      .multipliedBy(new BigNumber(10).pow(chosenTokenDecimalsInput))
      .toString();

    // const maxApproval = new BigNumber(2).pow(256).minus(1);
    // let maxApproval = new BigNumber("2")
    //   .pow(new BigNumber("256"))
    //   .minus(new BigNumber("1"));
    // let maxApproval = new web3.utils.BN("2").pow(new web3.utils.toBN("255"));
    // const maxApprovalBN = web3.utils.isBN(maxApproval);
    console.log(`This is the max approval ${maxApproval.toString()}`);
    console.log(
      `This is the allowance target ${swapQuoteJSON.allowanceTarget}`
    );
    // console.log(
    //   `This is the max approval ethers ${maxApprovalEthers.toString()}`
    // );
    // const maxApproval = BigInt(2 ** 256 - 1);
    const tx = await ERC20TokenContract.methods
      .approve(swapQuoteJSON.allowanceTarget, maxApproval)
      .send({ from: userAddress })
      .then((tx) => {
        console.log("tx: ", tx);
      });

    //INITIATING SWAP
    // try {
    //   const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    //   console.log("receipt: ", receipt);
    // } catch (error) {
    //   console.error("Error has occurred: ", error);
    // }

    // Construct the transaction object
    const transactionObject = {
      from: userAddress, // The sender's Ethereum address
      to: swapQuoteJSON.to, // The recipient's Ethereum address (contract address)
      value: "0x0", // Amount of Ether to send (0 in this case)
      gas: swapQuoteJSON.gas, // Gas limit (or gas estimate)
      gasPrice: swapQuoteJSON.gasPrice, // Gas price (in Wei)
      data: swapQuoteJSON.data, // Data containing the function call (hex-encoded)
    };

    // Send the transaction
    await web3.eth
      .sendTransaction(transactionObject)
      .on("transactionHash", (hash) => {
        console.log(`Transaction hash: ${hash}`);
      })
      .on("receipt", (receipt) => {
        console.log("Transaction receipt:", receipt);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(`Confirmation #${confirmationNumber}`, receipt);
      })
      .on("error", (error) => {
        console.error("Error sending transaction:", error);
      });

    // const { config } = usePrepareSendTransaction({
    //   to: swapQuoteJSON?.to, // The address of the contract to send call data to, in this case 0x Exchange Proxy
    //   data: swapQuoteJSON?.data, // The call data required to be sent to the to contract address.
    // });

    // useSendTransaction(config);
  }

  return (
    <div>
      <button
        className="border-2 rounded-lg py-2 px-16 mt-6 hover:bg-zinc-300"
        onClick={() => {
          swapTokens();
        }}
        disabled={!connected}
      >
        SWAP
      </button>
    </div>
  );
}
