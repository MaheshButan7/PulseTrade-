import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar(){
    const [name , setName] = useState("")
    const navigate = useNavigate();

useEffect(()=>{
    const info = async ()=>{
        const res = await api.get("/auth/me")
        setName(res.data.name);
    }
    info();
} , [])
function handleLogout(){
    localStorage.removeItem("token");
    navigate("/")
}

return(
    <div className="w-full bg-black/40 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center px-8 py-4 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <p className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-2xl tracking-tight drop-shadow-md">Pulse Trade</p>
        <div className="flex gap-6 items-center">
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                Dashboard
            </Link>
            <Link to="/history" className="text-gray-400 hover:text-white transition-colors text-sm">
                History
            </Link>
        </div>
        <div className="flex gap-4 items-center">
        <p className="text-gray-300 font-medium text-md ">{name}</p>
        <button className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 text-sm px-5 py-2 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5" onClick={handleLogout}>Logout</button>
    </div>
    </div>
)
}