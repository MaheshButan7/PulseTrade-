import { useEffect, useState, useRef } from "react";
import api from "../api/axios"
import StatCard  from "../components/StatCard";
import TradeModal from "../components/TradeModal";
import Navbar from "../components/Navbar";
import PortfolioPieChart from "../components/PortfolioPieChart";

interface Holding{
    symbol: string
    quantity:number
    avgPrice: number
    currentPrice: number
    value: number
}

interface MarketPrices {
    BTC: number
    ETH: number
    SOL: number
}

export default function Dashboard(){
   const [balance,setBalance] = useState(0);
   const [totalValue,setTotalValue] = useState(0);
   const [holdings,setHoldings] = useState<Holding[]>([]);

   const [isModalOpen , setIsModalOpen] = useState(false);
   const [selectedCoin , setSelectedCoin] = useState("")
   const [action , setAction] = useState("")

   const [priceFlash , setPriceFlash] = useState<{[key: string]:"up"|"down"|null}>({})
   const prevPrices = useRef<{[key:string]:number}>({})

   const [loading , setLoading] = useState(false);

   const [marketPrices , setMarketPrices] = useState<MarketPrices>({BTC:0 , ETH:0 , SOL:0})

   const [isProfitSell , setIsProfitSell] = useState(false)

   const fetchMarketPrices = async ()=>{
    const res = await api.get("/market/prices")
    setMarketPrices(res.data);
   }

    const fetchPortfolio = async(showLoader = true)=>{
    try{
        if (showLoader) setLoading(true);
        const res = await api.get("/portfolio")
        const newHoldings = res.data.holdings

        const newFlash: {[key:string]:"up"|"down"|null} = {}
        newHoldings.forEach((h: Holding)=>{
            const prev = prevPrices.current[h.symbol]
            if(prev !== undefined){
               if(h.currentPrice > prev) newFlash[h.symbol] = "up"
               else if(h.currentPrice < prev) newFlash[h.symbol] = "down"
               else newFlash[h.symbol] = null  
            }
            prevPrices.current[h.symbol]= h.currentPrice ;
        })

        setPriceFlash(newFlash)

        setTimeout(()=> setPriceFlash({}) , 3000)

        setBalance(res.data.balance);
        setTotalValue(res.data.totalValue);
        setHoldings(newHoldings);
    }
    catch(err){
        console.error("Failed to fetch portfolio" , err)
    }
    finally{
        if (showLoader) setLoading(false);
    }
   }
   useEffect(()=>{
   fetchPortfolio(true);
   fetchMarketPrices();
   },[])

   useEffect(()=>{
    const interval = setInterval(()=>{
        fetchPortfolio(false);
        fetchMarketPrices();
    },30000)

    return ()=> clearInterval(interval);
   },[])

   return(
    
    <div className="min-h-screen w-full flex flex-col bg-black text-white">
        <Navbar />
        {loading?(
        <div className="flex items-center justify-center flex-1">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>)
        :(<div className="p-10">
        <h1 className="text-3xl font-bold mb-6"> Dashboard </h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard 
            title="Cash Balance"
            value={`$${balance.toFixed(2)}`}
            color="text-white"
            />

            <StatCard 
            title="Total Portfolio Value"
            value={`$${totalValue.toFixed(2)}`}
            color="text-blue-400"
            />

            <StatCard 
            title="Overall P&L"
            value={`$${(totalValue-balance).toFixed(2)}`}
            color={(totalValue-balance)>=0 ? "text-green-400" : "text-red-400"}
            />
        </div>

        <PortfolioPieChart holdings={holdings} balance={balance} />

            <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Holdings</h2>
           <table className="w-full text-left">
           <thead>
           <tr className="text-gray-400 text-sm border-b border-gray-800">
            <th className="pb-3 px-4 w-1/6">Coin</th>
            <th className="pb-3 px-4 w-1/6">Quantity</th>
            <th className="pb-3 px-4 w-1/6">Avg Buy Price</th>
            <th className="pb-3 px-4 w-1/6">Current Price</th>
            <th className="pb-3 px-4 w-1/6">Value</th>
            <th className="pb-3 px-4 w-1/6">P&L</th>
            <th className="pb-3 px-4 w-1/6">Actions</th>
        </tr>
    </thead>
    <tbody>
        {holdings.map((holding) => {
            const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice * 100).toFixed(2)
            const isProfit = Number(pnlPercent) >= 0

            return (
                <tr key={holding.symbol} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                    <td className="py-4 px-4 font-bold">{holding.symbol}</td>
                    <td className="py-4 px-4">{holding.quantity}</td>
                    <td className="py-4 px-4">${holding.avgPrice.toFixed(2)}</td>
                    <td className={`py-4 px-4 font-bold transition colors duration-500 ${
                        priceFlash[holding.symbol] === 'up' ? "text-green-400"
                        : priceFlash[holding.symbol] === 'down' ? "text-red-400"
                        : "text-white"
                    }`}>${holding.currentPrice.toFixed(2)}</td>
                    <td className="py-4 px-4">${holding.value.toFixed(2)}</td>
                    <td className={`py-4 px-4 font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                        {isProfit ? "+" : ""}{pnlPercent}%
                    </td>
                    <td className="py-4 px-4">
                    <button
                    onClick={() => {
                    setSelectedCoin(holding.symbol)
                    setAction("buy")
                    setIsModalOpen(true)
                    }}
        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded mr-2">
        Buy
    </button>
    <button
        onClick={() => {
            setSelectedCoin(holding.symbol)
            setAction("sell")
            setIsModalOpen(true)
            const pnl = holding.currentPrice - holding.avgPrice
            setIsProfitSell(pnl>0)
        }}
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
    >
        Sell
    </button>
</td>
                </tr>
            )
        })}
    </tbody>
</table>
</div>

<TradeModal 
isOpen={isModalOpen}
coin={selectedCoin}
action={action}
onClose={()=> {setIsModalOpen(false)}}
onSuccess={fetchPortfolio}
isProfit={isProfitSell}
/>

<div className="mt-12">
    <h2 className="text-xl font-bold mb-4">Market</h2>
    <div className="grid grid-cols-3 gap-4">
        {(["BTC" , "ETH" , "SOL"] as const).map((coin)=>(
            <div key={coin} className="bg-gray-900 rounded-xl p-6 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <p className="text-white font-bold text-lg">{coin}</p>
                    <p className="text-blue-400 font-bold text-xl">${marketPrices[coin].toLocaleString()} </p>
                </div>
                <button
                onClick={()=>{
                    setSelectedCoin(coin)
                    setAction("buy")
                    setIsModalOpen(true)
                }}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg trasition-colors font-bold"
                >Buy {coin}</button>
            </div>
        ))}
    </div>
</div>

</div>

    )}
</div>
)   
}
