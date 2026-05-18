import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

interface history {
    symbol: string
    type: string
    quantity: number
    price: number
    timestamp: string
}

export default function TransactionHistory(){
    const [transaction , setTransaction] = useState<history[]>([]);
    const [loading , setLoading] = useState(false);

    useEffect(()=>{
        
        const info = async()=>{
            try{
            setLoading(true)
            const res = await api.get("/portfolio/history")
            setTransaction(res.data.transaction)
        }
        catch(err){
            console.error(err)
        } 
        finally{
            setLoading(false);
        }
    }
        info()
    },[])

    return (
        <div className="min-h-screen w-full flex flex-col relative">
            <Navbar />
            {loading ? (
                <div className="flex items-center justify-center flex-1">
                    <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"/>
                </div>
            ) : (
                <div className="p-10 max-w-5xl mx-auto w-full z-10 relative">
                    <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight drop-shadow-md">Transaction History</h1>
                    {transaction.length=== 0 ? (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-xl">
                            <p className="text-gray-400">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
                            <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10 bg-black/20">
                                    <th className="py-4 px-6 w-1/5 font-medium">Coin</th>
                                    <th className="py-4 px-6 w-1/5 font-medium">Type</th>
                                    <th className="py-4 px-6 w-1/5 font-medium">Quantity</th>
                                    <th className="py-4 px-6 w-1/5 font-medium">Price</th>
                                    <th className="py-4 px-6 w-1/5 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.map((tx , index)=>(
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6 font-bold">{tx.symbol}</td>
                                        <td className={`py-4 px-6 font-bold ${tx.type === "BUY" ? "text-green-400" : "text-red-400"}`}>{tx.type}</td>
                                        <td className="py-4 px-6 font-bold">{tx.quantity}</td>
                                        <td className="py-4 px-6 font-bold">${tx.price.toFixed(2)}</td>
                                        <td className="py-4 px-6 text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                        </div>
                    )
                }
                </div>
            )
        }

        </div>
    )
}