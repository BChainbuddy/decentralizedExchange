import { useState, useEffect } from "react";

async function getTokenList() {
  const response = await fetch("https://tokens.coingecko.com/uniswap/all.json");
  const tokenListJSON = await response.json();
  return tokenListJSON.tokens;
}

export default function Input({
  chooseTokenInput,
  chosenTokenInput,
  chooseTokenAddressInput,
  chooseTokenDecimalsInput,
  setInputAmount,
}) {
  const [modal, showModal] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [inputText, setInputText] = useState("");

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
    chooseTokenInput(symbol);
    chooseTokenAddressInput(address);
    chooseTokenDecimalsInput(decimals);
    closeModal();
  }

  function shortenSymbol(longSymbol) {
    const newSymbol = longSymbol.substring(0, 5).toString() + "..";
    return newSymbol;
  }

  const handleClose = (e) => {
    if (e.target.id === "wrapper") {
      closeModal();
    }
  };

  async function tokenListInit() {
    try {
      const allTokens = await getTokenList();
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
          step="0.1"
          placeholder="100"
          min="0"
          onChange={(e) => setInputAmount(e.target.value)}
        ></input>
        <button
          className="border-2 rounded-r-md px-3 hover:bg-zinc-300"
          onClick={openModal}
        >
          {chosenTokenInput.length > 6
            ? shortenSymbol(chosenTokenInput)
            : chosenTokenInput}
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
                  className="hover-bg-zinc-300 flex justify-center items-center border border-gray-600 py-2 space-x-1"
                  key={`${token.symbol}-${index}`}
                  onClick={() => {
                    willChooseToken(
                      token.symbol,
                      token.address,
                      token.decimals
                    );
                  }}
                >
                  <span className="">{token.symbol}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
