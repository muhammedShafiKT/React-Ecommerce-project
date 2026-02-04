import { useNavigate } from "react-router-dom";
import { useCart } from "./Cartprovider.jsx";
import { Navbar } from "./Navbar.jsx";


const Cart = () => {
  const { cart, increaseQty, decreaseQty, removeItem } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  if (!cart.length) {
    return (
      <div>
        <Navbar/>
      <div className="min-h-screen bg-[#0f0a07] flex flex-col items-center justify-center">
       
        <h2 className="text-[#c8a97e] font-serif italic text-2xl tracking-widest opacity-40 uppercase">
          Your Cart is Empty
        </h2>
        <div className="h-[1px] w-12 bg-[#c8a97e]/20 mt-4"></div>
      </div>
      </div>
    );
  }

  return (
    <div>
        <Navbar/>
    <div className="h-screen bg-[#0f0a07] overflow-y-auto text-white px-6 py-16 lg:px-20">
      <div className="max-w-6xl mx-auto">
        
       
        <div className="mb-16">
          <h1 className="text-4xl font-serif italic tracking-wider text-white">Shopping Cart</h1>
          <div className="h-[1px] w-20 bg-[#c8a97e] mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          
          <div className="lg:col-span-2 space-y-8">
            {cart.map(item => (
              <div 
                className="flex gap-6 border-b border-[#c8a97e]/10 pb-8 group" 
                key={item.productId}
              >
              
                <div className="w-24 h-32 bg-[#1a140e] overflow-hidden border border-[#c8a97e]/10">
                  <img
                    src={item.images}
                    alt={item.description}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-serif italic tracking-wide text-white/90">
                        {item.description}
                    </h3>
                    <p className="text-[#c8a97e] text-sm mt-1 font-light tracking-tighter">
                        ₹ {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
             
                    <div className="flex items-center border border-[#c8a97e]/20 px-2 py-1 gap-4">
                      <button
                        className="text-[#c8a97e] hover:text-white transition-colors w-6"
                        onClick={() => decreaseQty(item.productId)}
                      >
                        —
                      </button>

                      <span className="text-sm font-light w-4 text-center">{item.qty}</span>

                      <button
                        className="text-[#c8a97e] hover:text-white transition-colors w-6"
                        onClick={() => increaseQty(item.productId)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="text-[10px] uppercase tracking-widest text-white/30 hover:text-rose-500 transition-colors"
                      onClick={() => removeItem(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1a140e]/40 border border-[#c8a97e]/10 p-8 sticky top-32">
              <h2 className="text-[10px] uppercase tracking-[0.4em] text-[#c8a97e] mb-6">Summary</h2>
              
              <div className="flex justify-between items-baseline mb-8">
                <span className="text-white/40 text-[11px] uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl font-serif italic text-[#e6c89c]">
                    ₹ {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button 
              onClick={() => navigate("/detailsandpayment")}
              className="w-full bg-[#c8a97e] text-[#1a140e] py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#f5deb3] transition-all duration-500">
                Proceed to Checkout
                
              </button>
              
              <p className="text-[9px] text-white/20 uppercase tracking-widest text-center mt-6">
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
};

export default Cart;