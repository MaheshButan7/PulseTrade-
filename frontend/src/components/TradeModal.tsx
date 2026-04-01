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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-8 w-96 flex flex-col gap-4">
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
                className="bg-gray-800 text-white p-3 rounded-lg outline-none"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button 
                onClick={handleTrade}
                disabled={loading}
                className={`w-full p-3 rounded-lg font-bold tansition-colors ${
                    action === "buy"? "bg-green-500 hover:bg-green-600"
                    : "bg-green-500 hover:bg-red-600"
                }${loading? "opacity-50 cursor-not-allowed":""}
                `}
                >
                    {loading? "Processing..." : `Confirm ${action==="buy" ? "Buy" : "Sell"}`}
                </button>
            </div>
        </div>
    )
}
