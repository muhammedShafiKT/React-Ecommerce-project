import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/* =========================
   VALIDATION SCHEMA
   ========================= */

const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),

  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),

  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  /* =========================
     SUBMIT HANDLER
     ========================= */

  const userdetailsadd = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "user",
      status: "active",
      cart: [],
      wishlist: [],
      orders: [],
    };

    try {
      // 🔹 STEP 1 — Check if email already exists
      const checkUser = await axios.get(
        `http://localhost:3001/user?email=${data.email}`
      );

      if (checkUser.data.length > 0) {
        toast.error("This email is already registered");
        return; // STOP execution
      }

      // 🔹 STEP 2 — Register only if email is new
      await axios.post("http://localhost:3001/user", payload);

      toast.success("Registration successful");
      reset();
      navigate("/login");
    } catch (err) {
      console.error(err);

      if (err.response) {
        toast.error(
          err.response.data?.message || "Server error. Try again."
        );
      } else {
        toast.error("Network error. Check backend.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0a07] px-4">
      <div className="w-full max-w-md bg-[#1a140e]/60 backdrop-blur-2xl border border-[#c8a97e]/20 shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-10">

        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif tracking-[0.15em] text-[#e6c89c] uppercase italic">
            Create Account
          </h2>
          <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mt-4">
            Sign up to get started
          </p>
          <div className="h-[1px] w-16 bg-[#c8a97e]/30 mx-auto mt-6"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(userdetailsadd)}>

          {/* NAME */}
          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">
              Name
            </label>

            <input
              {...register("name")}
              type="text"
              placeholder="Michael"
              className="placeholder:text-white/5 px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] outline-none transition-all duration-700 font-light text-sm"
            />

            {errors.name && (
              <span className="text-red-400 text-xs mt-1">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">
              Email
            </label>

            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] outline-none transition-all duration-700 placeholder:text-white/5 font-light text-sm"
            />

            {errors.email && (
              <span className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">
              Password
            </label>

            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] outline-none transition-all duration-700 placeholder:text-white/5 font-light text-sm"
            />

            {errors.password && (
              <span className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1 group">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#c8a97e]/70 ml-1">
              Confirm Password
            </label>

            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="px-0 py-2 bg-transparent text-white border-b border-[#c8a97e]/20 focus:border-[#f5deb3] outline-none transition-all duration-700 placeholder:text-white/5 font-light text-sm"
            />

            {errors.confirmPassword && (
              <span className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 py-4 bg-[#c8a97e] text-[#1a140e] text-[11px] tracking-[0.4em] uppercase font-bold hover:bg-[#f5deb3] transition-all duration-700 shadow-2xl active:scale-95"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#c8a97e] hover:text-white transition-all duration-500 ml-1 border-b border-[#c8a97e]/40"
            >
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}