import { useEffect, useState } from "react"

export default function TokenList({ tokenList, willChooseToken, showModal }) {
    const [filteredTokens, setFilteredTokens] = useState([])

    const closeModal = () => {
        showModal(false)
    }

    const handleClose = e => {
        if (e.target.id === "wrapper") {
            closeModal()
        }
    }

    function filterTokenList(text) {
        const filterTokens =
            text !== ""
                ? filteredTokens.filter(token =>
                      token.symbol.toLowerCase().includes(text.toLowerCase())
                  )
                : tokenList
        setFilteredTokens(filterTokens)
    }

    useEffect(() => {
        setFilteredTokens(tokenList)
    }, [])

    return (
        <div
            className="fixed inset-0 bg-opacity backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="w-[300px] flex flex-col">
                <button className="text-white text-xl place-self-end" onClick={closeModal}>
                    X
                </button>
                <input
                    className="bg-slate-300 rounded-t-md p-2 text-gray-600"
                    type="text"
                    placeholder="Search symbol..."
                    onChange={e => filterTokenList(e.target.value)}
                ></input>
                <div
                    id="tokenList"
                    className="bg-amber-50 rounded text-center text-black flex flex-col overflow-y-auto h-80"
                >
                    {filteredTokens.map((token, index) => (
                        <button
                            className="hover-bg-zinc-300 flex justify-center items-center border border-gray-600 py-2 space-x-1"
                            key={`${token.symbol}-${index}`}
                            onClick={() => {
                                willChooseToken(token.symbol, token.address)
                                closeModal()
                            }}
                        >
                            {token.symbol}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
