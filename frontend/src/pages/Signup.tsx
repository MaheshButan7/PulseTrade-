import { useState } from "react";
import api from "../api/axios"
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"

export default function Signup(){
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [name , setName] = useState("");

    const navigate = useNavigate();

    const handleSignup = async ()=>{
        const res = await api.post("/auth/signup" , {
            email,
            password,
            name
        })

        localStorage.setItem("token" , res.data.token);

        navigate("/dashboard");
    }
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
            <div className="p-6 bg-gray-900 rounded-xl w-80">
                <h1 className="text-2xl text-white mb-4 flex justify-center">Signup</h1>

                <input 
                className="w-full p-2 mb-2 bg-gray-800"
                placeholder="Name"
                onChange={(e)=> setName(e.target.value)}
                />

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
                className="w-full bg-blue-500 p-2 rounded"
                onClick={handleSignup}
                >Signup
                </button>

                <p className="text-sm text-gray-400 mt-3 text-center">
                    Already have an account?{" "} <Link to={"/Login"} className="text-blue-400 hover:underline">Login</Link>
                </p>

            </div>
        </div>
    )
}