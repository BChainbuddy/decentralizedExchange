"use client";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import dotenv from "dotenv";

dotenv.config();

export default function Swap({
  chosenTokenAddressInput,
  chosenTokenAddressOutput,
  chosenTokenDecimalsOutput,
  chosenTokenDecimalsInput,
  amountOutput,
  inputAmount,
}) {
  async function swapTokens() {
    //GET THE ACCOUNT AND ERC20 CONTRACT
    let accounts = await ethereum.request({ method: "eth_accounts" });
    let userAddress = accounts[0];
    const web3 = new Web3(Web3.givenProvider);
    const erc20abi = [
      [
        {
          constant: true,
          inputs: [],
          name: "name",
          outputs: [
            {
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_spender",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_from",
              type: "address",
            },
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [
            {
              name: "",
              type: "uint8",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              name: "_owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              name: "balance",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: true,
          inputs: [],
          name: "symbol",
          outputs: [
            {
              name: "",
              type: "string",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          constant: false,
          inputs: [
            {
              name: "_to",
              type: "address",
            },
            {
              name: "_value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              name: "",
              type: "bool",
            },
          ],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          constant: true,
          inputs: [
            {
              name: "_owner",
              type: "address",
            },
            {
              name: "_spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              name: "",
              type: "uint256",
            },
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
        },
        {
          payable: true,
          stateMutability: "payable",
          type: "fallback",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
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
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
      ],
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
      sellAmount: Number(inputAmount * 10 ** chosenTokenDecimalsInput), //NEEDS TO BE * DECIMALS
      takerAddress: userAddress,
    };
    const response = await fetch(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
      {
        headers: {
          "0x-api-key": process.env.Api_key,
        },
      }
    );

    let swapQuoteJSON = response.json();
    console.log("Price: ", swapQuoteJSON);

    //GETTING QUOTE APPROVA
    const maxApproval = new BigNumber(2).pow(256).minus(1);
    ERC20TokenContract.methods
      .approve(swapQuoteJSON.allowancetarget, maxApproval)
      .send({ from: takerAddress })
      .then((tx) => {
        console.log(tx);
      });

    //INITIATING SWAP
    const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
    console.log("receipt: ", receipt);
  }

  return (
    <div>
      <button
        className="border-2 rounded-lg py-2 px-16 mt-6 hover:bg-zinc-300"
        // disabled={!connected}
      >
        SWAP
      </button>
    </div>
  );
}
