import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate()

  const [userdetails, setuserdetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cart:[],
    wishlist:[],
    orders:[]
  

  })

  function userdatafn(e) {
    const { name, value } = e.target
    setuserdetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function userdetailsadd(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/user", userdetails);
      toast.success("Registration successfull")
    } catch (err) {
      console.error(err);
    }
    navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a07] px-4">
      <div className="w-full max-w-md bg-[#1a140e]/60 backdrop-blur-2xl border border-[#c8a97e]/20 shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-10">

        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif tracking-[0.15em] text-[#e6c89c] uppercase italic">Create Account</h2>
          <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mt-4">
            Sign up to get started
          </p>
          <div className="h-[1px] w-16 bg-[#c8a97e]/30 mx-auto mt-6"></div>
        </div>

        <form
          className="space-y-6"
          onSubmit={userdetailsadd}
        >

          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">Name</label>
            <input
              onChange={userdatafn}
              name="name"
              type="text"
              placeholder="Michael"
              className="  placeholder:text-white/5  px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] 
                         outline-none transition-all duration-700  font-light text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">Email</label>
            <input
              onChange={userdatafn}
              type="email"
              name="email"
              placeholder="you@example.com"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] 
                         outline-none transition-all duration-700 placeholder:text-white/5 font-light text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">Password</label>
            <input
              name="password"
              onChange={userdatafn}
              type="password"
              placeholder="••••••••"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] 
                         outline-none transition-all duration-700 placeholder:text-white/5 font-light text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">confirm Password</label>
            <input
              name="confirmPassword"
              onChange={userdatafn}
              type="password"
              placeholder="••••••••"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] 
                         outline-none transition-all duration-700 placeholder:text-white/5 font-light text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-4 bg-[#c8a97e] text-[#1a140e] text-[11px] tracking-[0.4em] uppercase font-bold 
                       hover:bg-[#f5deb3] transition-all duration-700 shadow-2xl active:scale-95"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            Already have an account?{" "}
            <Link to="/login"
              className="text-[#c8a97e] hover:text-white transition-all duration-500 ml-1 border-b border-[#c8a97e]/40">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}