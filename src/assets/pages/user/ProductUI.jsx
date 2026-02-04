import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "./Cartprovider";
import { Navbar } from "./Navbar";
import toast from "react-hot-toast";
import { useWishlist } from "./Wishlistprovider";
function ProductUI() {

  const {addToCart} = useCart()
  const {addToWishlist} = useWishlist()

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a07] flex items-center justify-center">
        <p className="text-[#c8a97e] text-[10px] tracking-[0.5em] uppercase animate-pulse">
          Loading Masterpiece…
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f0a07] flex items-center justify-center text-center">
        <div>
           <p className="text-[#c8a97e] text-[10px] tracking-[0.4em] uppercase mb-4">Error</p>
           <h2 className="text-white font-serif italic text-2xl">Product not found</h2>
        </div>
      </div>
    );
  }

  return (
   <div>
    <Navbar/>
    <div className="h-screen bg-[#0f0a07] overflow-y-auto flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full bg-[#1a140e]/40 backdrop-blur-3xl border border-[#c8a97e]/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 md:grid-cols-2">

     
        <div className="relative bg-[#120d0a] flex items-center justify-center p-12 overflow-hidden group">
          <img
            src={product.images}
            alt={product.title}
            className="w-full h-[500px] object-contain transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
         
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
        </div>

   
        <div className="p-12 md:p-16 flex flex-col justify-center">
          
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#c8a97e] mb-4">
              {product.brand || "Exclusive Collection"}
            </p>
            <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wider leading-tight italic">
              {product.title}
            </h1>
            <div className="h-[1px] w-20 bg-[#c8a97e]/40 mt-8"></div>
          </div>

          <p className="text-3xl font-light text-[#e6c89c] tracking-tighter mb-8">
            ₹{product.price?.toLocaleString()}
          </p>

          <div className="space-y-6">
             <p className="text-white/60 text-sm leading-[1.8] font-light tracking-wide">
               {product.description}
             </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <button
            onClick={()=>{addToCart(product)
              toast.success("item added to cart")
            }}
              className="flex-1 bg-[#c8a97e] hover:bg-[#f5deb3] text-[#1a140e] py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 shadow-xl active:scale-95"
            >
              Add to Cart
            </button>

            <button
              className="flex-1 border border-[#c8a97e]/40 hover:border-[#c8a97e] text-[#c8a97e] hover:text-white py-4 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500 active:scale-95"
            >
              Buy Now
            </button>
          </div>

          <p className="mt-8 text-[9px] uppercase tracking-[0.2em] text-white/20 text-center">
            Complimentary white-glove delivery included
          </p>
        </div>

      </div>
    </div>
    </div>
  );
}

export default ProductUI;