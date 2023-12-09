

export default function Pool({ symbol1, symbol2, price, liquidity, yields}) {
    return (
        <div className="transition-all duration-500 border-2 text-gray-400 cursor-pointer text-center rounded-xl px-3 py-4 space-y-3 hover:shadow-xl hover:shadow-cyan-500 hover:text-cyan-500">
            <div className="mt-2">
              <p className="text-3xl">USDT/BTC</p>
              <p className="text-base mt-2">price: 123.132</p>
            </div>
            <div>
              <p className="text-lg">YIELD GIVEN</p>
              <p>12312412.12412</p> 
            </div>
            <div>
              <p className="text-xl">TTL LIQUIDITY</p>
              <p>111111111m</p>
            </div>
        </div>
    )
}