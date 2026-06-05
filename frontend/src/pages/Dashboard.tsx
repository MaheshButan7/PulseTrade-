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

   const [aiSummary, setAiSummary] = useState("");
   const [aiLoading, setAiLoading] = useState(false);
   const [aiError, setAiError] = useState("");

   const fetchAiSummary = async () => {
       try {
           setAiLoading(true);
           setAiError("");
           const res = await api.get("/portfolio/ai-summary");
           setAiSummary(res.data.summary);
       } catch (err: any) {
           console.error("Failed to generate AI summary:", err);
           setAiError(err.response?.data?.message || "Failed to generate AI summary");
           setAiSummary("");
       } finally {
           setAiLoading(false);
       }
   };

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <PortfolioPieChart holdings={holdings} balance={balance} />
            
            {/* AI Insights Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl animate-bounce duration-1000">🤖</span>
                        <h2 className="text-xl font-bold tracking-tight drop-shadow-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Portfolio Insights</h2>
                    </div>

                    {aiLoading ? (
                        <div className="flex flex-col gap-3 py-6 flex-1 justify-center">
                            <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded-full w-5/6 animate-pulse text-transparent">.</div>
                            <div className="h-4 bg-white/10 rounded-full w-2/3 animate-pulse text-transparent">.</div>
                            <div className="h-4 bg-white/10 rounded-full w-4/5 animate-pulse text-transparent">.</div>
                            <p className="text-xs text-blue-400 mt-4 animate-pulse font-medium">Gemini AI is analyzing your portfolio data...</p>
                        </div>
                    ) : aiSummary ? (
                        <div className="max-h-[220px] overflow-y-auto custom-scrollbar pr-2 py-1 text-left flex-1">
                            {renderMarkdown(aiSummary)}
                        </div>
                    ) : aiError ? (
                        <div className="flex flex-col justify-center items-center text-center py-6 gap-3 flex-1">
                            <span className="text-3xl">⚠️</span>
                            <p className="text-red-400 text-sm font-semibold max-w-sm">
                                {aiError}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center text-center py-8 gap-4 flex-1">
                            <p className="text-gray-400 text-sm max-w-sm">
                                Let Gemini analyze your assets, entry prices, and trading history to give you instant, plain-English portfolio advice and diversification tips.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end relative z-10">
                    <button
                        onClick={fetchAiSummary}
                        disabled={aiLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    >
                        {aiLoading ? "Analyzing..." : aiSummary ? "Recalculate Summary" : "Generate AI Insights"}
                    </button>
                </div>
            </div>
        </div>

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

function renderMarkdown(text: string) {
  if (!text) return null;
  
  return text.split('\n').map((line, index) => {
    const trimmed = line.trim();
    
    // Header 3
    if (trimmed.startsWith('### ')) {
      return <h3 key={index} className="text-lg font-bold text-blue-400 mt-4 mb-2">{trimmed.replace('### ', '')}</h3>;
    }
    // Header 4
    if (trimmed.startsWith('#### ')) {
      return <h4 key={index} className="text-md font-semibold text-purple-400 mt-3 mb-1">{trimmed.replace('#### ', '')}</h4>;
    }
    // Blockquote alerts
    if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!IMPORTANT]')) {
      return null; // Skip header line of alerts
    }
    if (trimmed.startsWith('>')) {
      return (
        <blockquote key={index} className="border-l-4 border-yellow-500/50 bg-yellow-500/5 p-3 rounded-r-lg my-2 text-sm text-yellow-200 italic">
          {trimmed.replace(/^>\s*(\*|\!)?/, '')}
        </blockquote>
      );
    }
    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      return (
        <li key={index} className="ml-4 list-disc text-gray-300 mb-1.5 text-sm leading-relaxed">
          {parseBoldText(content)}
        </li>
      );
    }
    // Horizontal rule
    if (trimmed === '---') {
      return <hr key={index} className="border-white/10 my-4" />;
    }
    // Empty line
    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }
    // Regular paragraph
    return (
      <p key={index} className="text-gray-300 text-sm leading-relaxed mb-2">
        {parseBoldText(trimmed)}
      </p>
    );
  });
}

function parseBoldText(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-extrabold text-white">{part}</strong>;
    }
    return part;
  });
}
