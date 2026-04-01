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
        <div className="min-h-screen w-full flex flex-col bg-black text-white">
            <Navbar />
            {loading ? (
                <div className="flex items-center justify-center flex-1">
                    <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"/>
                </div>
            ) : (
                <div className="p-10">
                    <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
                    {transaction.length=== 0 ? (
                        <p className="text-gray-400">No tansactions yet</p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-400 text-sm border-b border-gray-800">
                                    <th className="pb-3 px-4 w-1/5">Coin</th>
                                    <th className="pb-3 px-4 w-1/5">Type</th>
                                    <th className="pb-3 px-4 w-1/5">Quantity</th>
                                    <th className="pb-3 px-4 w-1/5">Price</th>
                                    <th className="pb-3 px-4 w-1/5">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.map((tx , index)=>(
                                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
                                        <td className="py-4 px-4 font-bold">{tx.symbol}</td>
                                        <td className={`py-4 px-4 font-bold ${tx.type === "BUY" ? "text-green-400" : "text-red-400"}`}>{tx.type}</td>
                                        <td className="py-4 px-4 font-bold">{tx.quantity}</td>
                                        <td className="py-4 px-4 font-bold">{tx.price.toFixed(2)}</td>
                                        <td className="py-4 px-4 text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
                </div>
            )
        }

        </div>
    )
}