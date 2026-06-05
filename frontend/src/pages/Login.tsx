import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login(){
    const [email ,setEmail] = useState("");
    const [password , setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async ()=>{
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const res = await api.post("/auth/signin" , {
                email,
                password
            })
            localStorage.setItem("token" , res.data.token)
            toast.success("Logged in successfully!");
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Login error:", err);
            const message = err.response?.data?.message || "Invalid credentials. Please try again.";
            toast.error(message);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-blob" style={{ animationDelay: '2s' }}></div>
            
            <div className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl w-96 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-4 relative z-10">
                <h1 className="text-3xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex justify-center tracking-tight">Welcome Back</h1>
                <p className="text-gray-400 text-sm text-center mb-4">Enter your details to access your portfolio</p>

                <input 
                className="w-full p-4 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500 text-white"
                placeholder="Email address"
                onChange={(e)=>setEmail(e.target.value)}
                />
                
                <input
                type="password" 
                className="w-full p-4 bg-black/40 border border-white/10 rounded-xl outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500 text-white"
                placeholder="Password"
                onChange={(e)=>setPassword(e.target.value)}
                />

                <button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold p-4 rounded-xl mt-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
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