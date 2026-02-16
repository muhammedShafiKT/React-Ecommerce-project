import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* =========================
   VALIDATION SCHEMA (CRITICAL)
   ========================= */

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Login() {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur", // validates when user leaves input
  });

  /* =========================
     LOGIN HANDLER (DATA FROM RHF)
     ========================= */

  const checkingfn = async (data) => {
    try {
      const res = await axios.get(
        `http://localhost:3001/user?email=${data.email}`
      );

      // ❌ No such email in database
      if (res.data.length === 0) {
        toast.error("User not found");
        return;
      }

      const user = res.data[0];

      // 🚫 BLOCKED USER CHECK
      if (user.status === "blocked") {
        toast.error("Your account is blocked.");
        return;
      }

      // ❌ Wrong password
      if (user.password !== data.password) {
        toast.error("Wrong password");
        return;
      }

      toast.success("Login successful");

      // ✅ ROLE-BASED NAVIGATION
      if (user.role === "admin") {
        localStorage.setItem("admin", JSON.stringify(user.id));
        nav("/admin");
      } else {
        localStorage.setItem("user", JSON.stringify(user.id));
        nav("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Server error. Try again later.");
    }

    reset(); // clears form after attempt
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a07] px-4">
      <div className="w-full max-w-md bg-[#1a140e]/60 backdrop-blur-2xl border border-[#c8a97e]/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-10">

        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif tracking-[0.2em] text-[#e6c89c] uppercase italic">
            Login
          </h2>
          <div className="h-[1px] w-12 bg-[#c8a97e]/30 mx-auto mt-4"></div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit(checkingfn)}>

          {/* EMAIL FIELD */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-[0.3em] text-[#c8a97e]/70 ml-1">
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] outline-none transition-all duration-700 placeholder:text-white/5 font-light"
            />

            {errors.email && (
              <span className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* PASSWORD FIELD */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] uppercase tracking-[0.3em] text-[#c8a97e]/70 ml-1">
              Password
            </label>

            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] outline-none transition-all duration-700 placeholder:text-white/5 font-light"
            />

            {errors.password && (
              <span className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 py-4 bg-[#c8a97e] text-[#1a140e] text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#f5deb3] transition-all duration-700 shadow-xl active:scale-95"
          >
            {isSubmitting ? "Logging in..." : "Login"}
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