import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav=useNavigate();
  const [userdetails, setuserdetails] = useState({
    email: "", password: ""
  })

  function userdatafn(e) {
    const { name, value } = e.target
    setuserdetails(prev => ({
      ...prev, 
      [name]: value
    }))
  }

  const checkingfn = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`http://localhost:3001/user?email=${userdetails.email}`)
      if (res.data.length === 0) {
        toast.error("User not found")
        return
      }
      const user = res.data[0];

      if (user.password !== userdetails.password) {
        toast.error("Wrong password")
        return
      }
    
      toast.success("Login successful")
      nav ('/home')
      localStorage.setItem("user", JSON.stringify(user.id))
    }
    catch (error) {
      toast.error('Something went wrong')
    }
    setuserdetails({
      email: '',
      password: ''
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a07] px-4">
 
      <div className="w-full max-w-md bg-[#1a140e]/60 backdrop-blur-2xl border border-[#c8a97e]/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-10">

    
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif tracking-[0.2em] text-[#e6c89c] uppercase italic">Login</h2>
          <div className="h-[1px] w-12 bg-[#c8a97e]/30 mx-auto mt-4"></div>
        </div>

     
        <form className="space-y-8" onSubmit={checkingfn}>

     
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-[0.3em] text-[#c8a97e]/70 ml-1">Email</label>
            <input
              onChange={userdatafn}
              name="email"
              value={userdetails.email}
              type="email"
              placeholder="you@example.com"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] 
                         outline-none transition-all duration-700 placeholder:text-white/5 font-light"
            />
          </div>

       
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-[0.3em] text-[#c8a97e]/70 ml-1">Password</label>
            <input
              type="password"
              value={userdetails.password}
              name="password"
              onChange={userdatafn}
              placeholder="••••••••"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] 
                         outline-none transition-all duration-700 placeholder:text-white/5 font-light"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-4 bg-[#c8a97e] text-[#1a140e] text-[11px] tracking-[0.4em] uppercase font-bold 
                       hover:bg-[#f5deb3] transition-all duration-700 shadow-xl active:scale-95"
          >
            Login
          </button>
        </form>

 
        <p className="text-center text-[10px] tracking-[0.2em] uppercase text-white/40 mt-10">
          Don't have an account?{" "}
          <Link
            className="text-[#c8a97e] hover:text-white transition-colors duration-500 ml-1 border-b border-[#c8a97e]/40"
            to="/register"
          >
            signup
          </Link>
        </p>
      </div>
    </div>
  );
}