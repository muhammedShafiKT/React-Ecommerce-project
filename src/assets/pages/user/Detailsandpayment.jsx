import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./Cartprovider.jsx";
import { Navbar } from "./Navbar.jsx";
import axios from "axios";

const DetailsAndPayment = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCart();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  /* =========================
     PREFILL FROM DB (LAST ADDRESS)
     ========================= */

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const userId = raw ? JSON.parse(raw) : null;

    if (!userId) return;

    const fetchUserAndPrefill = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/user/${userId}`
        );

        const user = res.data;

        // Prefer saved address if exists
        if (user.lastAddress) {
          setDetails(user.lastAddress);
        }
        // Otherwise fallback to last order
        else if (user.orders?.length) {
          const lastOrder = user.orders[user.orders.length - 1];
          if (lastOrder.customer) {
            setDetails(lastOrder.customer);
          }
        }
      } catch (err) {
        console.error("Prefill failed:", err);
      }
    };

    fetchUserAndPrefill();
  }, []);

  const handleChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const raw = localStorage.getItem("user");
    const userId = raw ? JSON.parse(raw) : null;

    if (!userId) {
      alert("Please login first!");
      navigate("/orders");
      return;
    }

    const newOrder = {
      orderId: "ORD-" + Date.now(),
      date: new Date().toISOString(),
      customer: details,
      paymentMethod,
      items: cart,
      total: totalPrice,
      status: "Processing",
    };

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      const user = res.data;

      // ✅ IMPORTANT: update BOTH orders + saved address
      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        {
          orders: [...(user.orders || []), newOrder],
          lastAddress: details,   // <---- THIS MAKES CHANGES PERSIST
          cart: []
        }
      );

      setCart([]);
      navigate("/orders");

    } catch (error) {
      console.error("Order failed:", error);
      alert("Order failed. Try again.");
    }
  };

  return (
    <div className="h-screen overflow-y-auto">
      <Navbar />

      <div className="
        overflow-y-auto 
        min-h-screen 
        bg-[#0f0a07] 
        text-white 
        px-6 
        pt-28 
        pb-16
        lg:px-20
      ">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          <form onSubmit={handleSubmit} className="space-y-8">

            <h1 className="text-3xl font-serif italic text-white/90">
              Delivery Details
            </h1>
            <div className="h-[1px] w-20 bg-[#c8a97e]"></div>

            <div className="grid grid-cols-1 gap-6">
              <input
                name="name"
                placeholder="Full Name"
                value={details.name}
                onChange={handleChange}
                required
                className="bg-[#1a140e] border border-[#c8a97e]/20 p-3 outline-none text-white"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                value={details.email}
                onChange={handleChange}
                required
                className="bg-[#1a140e] border border-[#c8a97e]/20 p-3 outline-none text-white"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={details.phone}
                onChange={handleChange}
                required
                className="bg-[#1a140e] border border-[#c8a97e]/20 p-3 outline-none text-white"
              />

              <textarea
                name="address"
                placeholder="Shipping Address"
                value={details.address}
                onChange={handleChange}
                required
                rows={3}
                className="bg-[#1a140e] border border-[#c8a97e]/20 p-3 outline-none text-white"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="city"
                  placeholder="City"
                  value={details.city}
                  onChange={handleChange}
                  required
                  className="bg-[#1a140e] border border-[#c8a97e]/20 p-3 outline-none text-white"
                />

                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={details.pincode}
                  onChange={handleChange}
                  required
                  className="bg-[#1a140e] border border-[#c8a97e]/20 p-3 outline-none text-white"
                />
              </div>
            </div>

            <h2 className="text-xl font-serif italic text-white/90 mt-10">
              Payment Method
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span>Cash on Delivery</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span>Credit / Debit Card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                <span>UPI / Google Pay</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#c8a97e] text-[#1a140e] py-4 mt-8 
              text-[10px] font-bold uppercase tracking-[0.3em] 
              hover:bg-[#f5deb3] transition-all duration-500"
            >
              Place Order
            </button>
          </form>

 
          <div>
            <div className="bg-[#1a140e]/40 border border-[#c8a97e]/10 p-8 sticky top-32">
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#c8a97e] mb-6">
                Order Summary
              </h2>

              {cart.map(item => (
                <div key={item.productId} className="flex justify-between text-sm mb-4">
                  <span className="text-white/70">
                    {item.description} × {item.qty}
                  </span>
                  <span className="text-[#e6c89c]">
                    ₹ {(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}

              <div className="h-[1px] bg-[#c8a97e]/20 my-6"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-white/40 text-[11px] uppercase tracking-widest">
                  Grand Total
                </span>
                <span className="text-2xl font-serif italic text-[#e6c89c]">
                  ₹ {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DetailsAndPayment;