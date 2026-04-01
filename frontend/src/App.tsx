import { BrowserRouter , Routes , Route } from "react-router-dom";
import Signup from "./pages/Signup"
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import TransactionHistory from "./pages/TransactionHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function App(){
  return (
    <BrowserRouter>
    <Toaster position="top-right"/>
    <Routes>
      <Route path="/" element={<Signup />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;