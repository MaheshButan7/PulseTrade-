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
    
    <div className="min-h-screen w-full flex flex-col relative">
        <Navbar />
        {loading?(
        <div className="flex items-center justify-center flex-1">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>)
        :(<div className="p-10 max-w-7xl mx-auto w-full z-10 relative">
        <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight drop-shadow-md"> Dashboard </h1>
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

            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold tracking-tight drop-shadow-sm">Your Holdings</h2>
            </div>
            <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
           <thead>
           <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10 bg-black/20">
            <th className="py-4 px-6 w-1/6 font-medium">Coin</th>
            <th className="py-4 px-6 w-1/6 font-medium">Quantity</th>
            <th className="py-4 px-6 w-1/6 font-medium">Avg Buy Price</th>
            <th className="py-4 px-6 w-1/6 font-medium">Current Price</th>
            <th className="py-4 px-6 w-1/6 font-medium">Value</th>
            <th className="py-4 px-6 w-1/6 font-medium">P&L</th>
            <th className="py-4 px-6 w-1/6 font-medium">Actions</th>
        </tr>
    </thead>
    <tbody>
        {holdings.map((holding) => {
            const pnlPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice * 100).toFixed(2)
            const isProfit = Number(pnlPercent) >= 0

            return (
                <tr key={holding.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 font-bold">{holding.symbol}</td>
                    <td className="py-4 px-6">{holding.quantity}</td>
                    <td className="py-4 px-6">${holding.avgPrice.toFixed(2)}</td>
                    <td className={`py-4 px-6 font-bold transition-colors duration-500 ${
                        priceFlash[holding.symbol] === 'up' ? "text-green-400"
                        : priceFlash[holding.symbol] === 'down' ? "text-red-400"
                        : "text-white"
                    }`}>${holding.currentPrice.toFixed(2)}</td>
                    <td className="py-4 px-6">${holding.value.toFixed(2)}</td>
                    <td className={`py-4 px-6 font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>
                        {isProfit ? "+" : ""}{pnlPercent}%
                    </td>
                    <td className="py-4 px-6">
                    <button
                    onClick={() => {
                    setSelectedCoin(holding.symbol)
                    setAction("buy")
                    setIsModalOpen(true)
                    }}
        className="bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/30 hover:border-green-500 text-sm px-4 py-1.5 rounded-lg mr-2 transition-all shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
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
        className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 hover:border-red-500 text-sm px-4 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
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
</div>

<TradeModal 
isOpen={isModalOpen}
coin={selectedCoin}
action={action}
onClose={()=> {setIsModalOpen(false)}}
onSuccess={fetchPortfolio}
isProfit={isProfitSell}
/>

<div className="mt-12 mb-12">
    <h2 className="text-xl font-bold mb-4 tracking-tight drop-shadow-sm">Market</h2>
    <div className="grid grid-cols-3 gap-6">
        {(["BTC" , "ETH" , "SOL"] as const).map((coin)=>(
            <div key={coin} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex justify-between items-center relative z-10">
                    <p className="text-white font-bold text-xl">{coin}</p>
                    <p className="text-blue-400 font-bold text-2xl">${marketPrices[coin].toLocaleString()} </p>
                </div>
                <button
                onClick={()=>{
                    setSelectedCoin(coin)
                    setAction("buy")
                    setIsModalOpen(true)
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white text-sm py-3 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-blue-500/25 relative z-10 hover:-translate-y-0.5"
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
