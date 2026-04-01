import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"
import { Link } from "react-router-dom";

export default function Login(){
    const [email ,setEmail] = useState("");
    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async ()=>{
        const res = await api.post("/auth/signin" , {
            email,
            password
        })
        localStorage.setItem("token" , res.data.token)

        navigate("/dashboard");
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-black text-white ">
            <div className="p-6 bg-gray-900 rounded-xl w-80">
                <h1 className="text-2xl mb-4 text-white flex justify-center">Login</h1>

                <input 
                className="w-full p-2 mb-2 bg-gray-800"
                placeholder="Email"
                onChange={(e)=>setEmail(e.target.value)}
                />
                
                <input
                type="password" 
                className="w-full p-2 mb-2 bg-gray-800"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
                />

                <button
                className="w-full bg-green-500 p-2 rounded"
                onClick={handleLogin}
                >Login
                </button>

                <p className="text-sm text-gray-400 mt-3 text-center">
                    Don't have an account?{" "}<Link to={"/"} className="text-green-400 hover:underline">Signup</Link>
                </p>
            </div>
        </div>
    )
}