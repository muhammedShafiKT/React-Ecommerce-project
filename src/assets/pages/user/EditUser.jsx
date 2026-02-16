import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export const ProfileEditor = () => {
  const userId = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3001/user/${userId}`)
      .then(res => {
        setForm({
          name: res.data.name || "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch(err => console.error("Fetch error:", err));
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Identification required";
    if (form.password || form.confirmPassword) {
      if (form.password.length < 8) newErrors.password = "Minimum 8 characters required";
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Credentials do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    const payload = {
      name: form.name,
      ...(form.password && { password: form.password }),
    };

    try {
      await axios.patch(`http://localhost:3001/user/${userId}`, payload);
      toast.success("Profile Updated", {
        style: { 
          background: '#0f0a07', 
          color: '#c8a97e', 
          border: '1px solid rgba(200, 169, 126, 0.2)',
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }
      });
      setForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      toast.error("Process failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0705] flex items-center justify-center p-6">
      <Toaster position="bottom-center" />
      
      <div className="w-full max-w-[450px]">
        {/* Simple Header */}
        <div className="mb-12 text-center">
          <h2 className="text-white text-2xl font-serif italic tracking-wider">Account Settings</h2>
          <div className="w-12 h-[1px] bg-[#c8a97e]/30 mx-auto mt-4"></div>
        </div>

        <div className="bg-[#0f0a07] border border-[#c8a97e]/10 p-10 md:p-14">
          <div className="space-y-10">
            
            {/* Input Group: Name */}
            <div className="relative">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-[#c8a97e]/20 py-3 text-white text-sm outline-none focus:border-[#c8a97e] transition-colors peer"
                placeholder=" "
              />
              <label className="absolute left-0 top-3 text-[#c8a97e]/40 text-[9px] uppercase tracking-[0.3em] pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#c8a97e] peer-[:not(:placeholder-shown)]:-top-4">
                Full Name
              </label>
              {errors.name && <p className="text-rose-900 text-[9px] uppercase mt-2 tracking-widest">{errors.name}</p>}
            </div>

            {/* Input Group: Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-[#c8a97e]/20 py-3 text-white text-sm outline-none focus:border-[#c8a97e] transition-colors peer"
                placeholder=" "
              />
              <label className="absolute left-0 top-3 text-[#c8a97e]/40 text-[9px] uppercase tracking-[0.3em] pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#c8a97e] peer-[:not(:placeholder-shown)]:-top-4">
                New Password
              </label>
              {errors.password && <p className="text-rose-900 text-[9px] uppercase mt-2 tracking-widest">{errors.password}</p>}
            </div>

            {/* Input Group: Confirm Password */}
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-[#c8a97e]/20 py-3 text-white text-sm outline-none focus:border-[#c8a97e] transition-colors peer"
                placeholder=" "
              />
              <label className="absolute left-0 top-3 text-[#c8a97e]/40 text-[9px] uppercase tracking-[0.3em] pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[#c8a97e] peer-[:not(:placeholder-shown)]:-top-4">
                Verify Password
              </label>
              {errors.confirmPassword && (
                <p className="text-rose-900 text-[9px] uppercase mt-2 tracking-widest">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <button
                onClick={handleUpdate}
                className="w-full py-4 bg-[#c8a97e] text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all duration-500"
              >
                Save Identity
              </button>
              
              <button 
                  onClick={() => window.history.back()}
                  className="w-full mt-6 text-[#c8a97e]/30 text-[9px] uppercase tracking-[0.2em] hover:text-[#c8a97e]/60 transition-colors"
              >
                  Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};