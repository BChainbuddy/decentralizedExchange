"use client"; // This is a client components

import { useState, useEffect } from "react";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

export default function Output({
  chooseTokenOutput,
  chosenTokenOutput,
  chosenTokenAddressInput,
  chooseTokenAddressOutput,
  chosenTokenAddressOutput,
  chosenTokenDecimalsInput,
  chooseTokenDecimalsOutput,
  chosenTokenDecimalsOutput,
  changeAmountOutput,
  inputAmount,
  amountOutput,
}) {
  const [modal, showModal] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [inputText, setInputText] = useState("");
  const [gasCost, setGasCost] = useState(null);

  // FETCH THE PRICE
  async function getPrice() {
    console.log(`Getting the best price...`);
    console.log(`This is the inputToken address ${chosenTokenAddressInput}`);
    console.log(`This is the outputToken address ${chosenTokenAddressOutput}`);
    console.log(`This is the current value of input token ${inputAmount}`);
    const params = {
      sellToken: chosenTokenAddressInput, //NEEDS TO BE AN ADDRESS
      buyToken: chosenTokenAddressOutput, // NEEDS TO BE AN ADDRESS
      sellAmount: Number(inputAmount * 10 ** chosenTokenDecimalsInput), //NEEDS TO BE * DECIMALS
    };
    const response = await fetch(
      `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`,
      {
        headers: {
          "0x-api-key": process.env.NEXT_PUBLIC_APIKEY,
        },
      }
    );
    const responseJSON = await response.json();
    if (responseJSON.price) {
      console.log(responseJSON);
      const newOutputAmount =
        responseJSON.buyAmount / 10 ** chosenTokenDecimalsOutput;
      console.log(newOutputAmount.toString());
      console.log(responseJSON.estimatedGas.toString());
      changeAmountOutput(newOutputAmount);
      setGasCost(responseJSON.estimatedGas);
    } else {
      console.log(`Error ${responseJSON.code}`);
      changeAmountOutput(0);
      setGasCost();
    }
  }

  function shortenSymbol(longSymbol) {
    const newSymbol = longSymbol.substring(0, 5).toString() + "..";
    return newSymbol;
  }

  useEffect(() => {
    if (
      inputAmount !== 0 &&
      chosenTokenAddressInput !== 0 &&
      chosenTokenAddressOutput !== 0
    ) {
      getPrice();
    }
  }, [inputAmount]);

  const openModal = () => {
    showModal(true);
  };

  const closeModal = () => {
    showModal(false);
  };

  function willChooseToken(symbol, address, decimals) {
    console.log(`This is the chosen token symbol ${symbol}`);
    console.log(`This is the chosen token address ${address}`);
    console.log(`This is the chosen token decimals ${decimals}`);
    chooseTokenOutput(symbol);
    chooseTokenAddressOutput(address);
    chooseTokenDecimalsOutput(decimals);
    closeModal();
  }

  const handleClose = (e) => {
    if (e.target.id === "wrapper") {
      closeModal();
    }
  };

  async function tokenListInit() {
    try {
      const response = await fetch(
        "https://tokens.coingecko.com/uniswap/all.json"
      );
      const tokenListJSON = await response.json();
      const allTokens = tokenListJSON.tokens;

      // Filter tokens based on the input text if it's not empty
      const filteredTokens =
        inputText !== ""
          ? allTokens.filter((token) =>
              token.symbol.toLowerCase().includes(inputText.toLowerCase())
            )
          : allTokens;

      setTokens(filteredTokens);
    } catch (error) {
      console.error("An error occurred in tokenListInit:", error);
    }
  }
  useEffect(() => {
    if (amountOutput !== 0) {
      console.log(amountOutput);
    }
  }, [amountOutput]);

  useEffect(() => {
    tokenListInit();
  }, [inputText]);

  return (
    <div>
      <div className="flex flex-row p-1">
        <input
          className="bg-slate-300 rounded-l-md border-2 p-2 text-gray-600"
          type="number"
          id="Amount"
          name="Amount"
          placeholder={amountOutput !== 0 ? amountOutput : 100}
          min="0"
          disabled
        ></input>
        <button
          className="transition ease-in-out duration-250 border-2 rounded-r-md px-3 hover:bg-zinc-300 hover:text-gray-600"
          onClick={openModal}
        >
          {chosenTokenOutput.length > 6
            ? shortenSymbol(chosenTokenOutput)
            : chosenTokenOutput}
        </button>
      </div>
      {modal ? (
        <div
          className="fixed inset-0 bg-opacity backdrop-blur-sm flex justify-center items-center"
          id="wrapper"
          onClick={handleClose}
        >
          <div className="w-[300px] flex flex-col">
            <button
              className="text-white text-xl place-self-end"
              onClick={closeModal}
            >
              X
            </button>
            <input
              className="bg-slate-300 rounded-t-md p-2 text-gray-600"
              type="text"
              placeholder="Search symbol..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></input>
            <div
              id="tokenList"
              className="bg-amber-50 rounded text-center text-black flex flex-col overflow-y-auto h-80"
            >
              {tokens.map((token, index) => (
                <button
                  className="hover:bg-zinc-300 flex justify-center items-center border border-gray-600 py-2 space-x-1"
                  key={`${token.symbol}-${index}`}
                  onClick={() => {
                    willChooseToken(
                      token.symbol,
                      token.address,
                      token.decimals
                    );
                  }}
                >
                  {/* <img className="" src={token.logoURI} alt={token.symbol} /> */}
                  <span className="">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex flex-row mt-6">
        <p>Estimated gas to swap:</p>
        <span className="ml-1">{gasCost}</span>
      </div>
    </div>
  );
}
