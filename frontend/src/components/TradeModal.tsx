import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

interface TradeModalProps{
    isOpen: boolean
    coin: string
    action: string
    onClose: ()=>void
    onSuccess: ()=>void
    isProfit ?: boolean
}

export default function TradeModal({isOpen ,coin , action , onClose ,onSuccess , isProfit}:TradeModalProps ){
    const [quantity , setQuantity] = useState("")
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState("")

    if(!isOpen) return null;

    const handleClose = ()=>{
        setError("")
        setQuantity("")
        onClose()
    }

    const handleTrade = async ()=>{
        if(!quantity || Number(quantity)<=0){
            setError("Enter a valid quantity")
            return
        }

        try{
            setLoading(true);
            setError("")

            if(action === "buy"){
                await api.post("trade/buy" , {
                    symbol: coin,
                    quantity: Number(quantity)
                })
            }
            else{
                await api.post("trade/sell" , {
                    symbol: coin,
                    quantity: Number(quantity)
                })
            }
            onSuccess();
            if(action === "sell" && isProfit){
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: {y:0.6}
                })
            }
            toast.success(`${action === "buy"? "Bought" : "Sold"} ${quantity} ${coin} successfully`)
            handleClose();
        }
        catch(err:any){
            toast.error(err.response?.data?.message || "Trade Failed")
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-96 flex flex-col gap-5 shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-fold">
                        {action === "buy"? "Buy" : "Sell"}{coin}
                    </h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-xl">✕</button>
                </div>

                <p className="text-gray-400 text-sm">
                    {action === "buy" ? "Buying from your cash balance" : "Selling from your holdings"}
                </p>
                
                <input 
                type="number"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e)=> setQuantity(e.target.value)}
                className="bg-black/50 border border-white/10 text-white p-4 rounded-xl outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500 relative z-10"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button 
                onClick={handleTrade}
                disabled={loading}
                className={`w-full p-4 rounded-xl font-bold transition-all duration-300 shadow-lg relative z-10 ${
                    action === "buy"? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 hover:shadow-green-500/25"
                    : "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 hover:shadow-red-500/25"
                } ${loading? "opacity-50 cursor-not-allowed": "hover:-translate-y-0.5"}`}
                >
                    {loading? "Processing..." : `Confirm ${action==="buy" ? "Buy" : "Sell"}`}
                </button>
            </div>
        </div>
    )
}
