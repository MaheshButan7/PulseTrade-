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
    <div className="w-full bg-gray-900 flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <p className="font-bold text-white text-xl ">Pulse Trade</p>
        <div className="flex gap-6 items-center">
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">
                Dashboard
            </Link>
            <Link to="/history" className="text-gray-400 hover:text-white transition-colors text-sm">
                History
            </Link>
        </div>
        <div className="flex gap-4 items-center">
        <p className="text-gray-300 font-bold text-md ">{name}</p>
        <button className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors" onClick={handleLogout}>Logout</button>
    </div>
    </div>
)
}