import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useCart } from "./Cartprovider";
import { useWishlist } from "./Wishlistprovider";
import toast from "react-hot-toast";
import "../../../index.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeItemFromWishlist } = useWishlist();

  const userId = localStorage.getItem("user");

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = (searchParams.get("search") || "")
    .toLowerCase()
    .trim();

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => {
        setTimeout(() => {
          setProducts(res.data);
          setLoading(false);
        }, 800); 
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery) ||
          p.brand?.toLowerCase().includes(searchQuery) ||
          p.category?.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="overflow-y-auto h-screen bg-[#0f0a07]">
      <Navbar />

      <div className="px-8 py-16">
        <div className="mb-20 text-center">
          <p className="text-[10px] tracking-[0.6em] text-[#c8a97e] uppercase mb-4 opacity-80">
            {searchQuery
              ? `Searching for: "${searchQuery}"`
              : "The Autumn Collection"}
          </p>
          <h2 className="text-5xl font-serif text-white italic tracking-widest">
            Products
          </h2>
          <div className="h-[1px] w-24 bg-[#c8a97e]/20 mx-auto mt-8"></div>
        </div>

        <div className="flex justify-between max-w-7xl mx-auto mb-10">
          <select
            className="bg-[#0f0a07] text-[#c8a97e] border border-[#c8a97e]/20 p-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loading}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            className="bg-[#0f0a07] text-[#c8a97e] border border-[#c8a97e]/20 p-2 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            disabled={loading}
          >
            <option value="none">Sort by price</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>

       
        {loading && (
          <div className="grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <div className="shimmer aspect-[4/5] rounded-md border border-[#c8a97e]/5" />

                <div className="mt-6 space-y-3">
                  <div className="shimmer block h-4 w-3/4 rounded" />
                  <div className="shimmer block h-3 w-1/3 rounded" />

                  <div className="pt-4 border-t border-[#c8a97e]/10 flex justify-between">
                    <div className="shimmer block h-3 w-1/4 rounded" />
                    <div className="shimmer block h-3 w-1/4 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center text-[#c8a97e] uppercase tracking-widest text-sm py-20">
            No products found for "{searchQuery}"
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlist.some(
                (item) => item.productId === product.id
              );

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-transparent transition-all duration-700 relative"
                >
                  <div className="relative overflow-hidden aspect-[4/5] bg-[#1a140e]/40 border border-[#c8a97e]/5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if(!userId){
                          return toast.error("Please login to manage your wishlist");
                        }
                        if (isWishlisted) {
                          removeItemFromWishlist(product.id);
                          toast.error("Removed from wishlist");
                        } else {
                          addToWishlist(product);
                          toast.success("Saved to wishlist");
                        }
                      }}
                      className={`absolute top-4 right-4 z-20 p-2 backdrop-blur-md border transition-all duration-300 active:scale-90 ${
                        isWishlisted
                          ? "bg-[#c8a97e] text-[#0f0a07] border-[#c8a97e] shadow-[0_0_20px_rgba(200,169,126,0.3)]"
                          : "bg-[#0f0a07]/40 text-[#c8a97e] border-[#c8a97e]/20 opacity-0 group-hover:opacity-100 hover:bg-[#c8a97e] hover:text-[#0f0a07]"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={isWishlisted ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 12-12Z"
                        />
                      </svg>
                    </button>

                    <Link
                      to={`/productsUI/${product.id}`}
                      className="block h-full"
                    >
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                        }
                        alt={product.description}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                      />
                    </Link>
                  </div>

                  <div className="mt-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-baseline mb-3">
                      <h3 className="text-white font-serif text-lg italic line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-[#e6c89c] text-sm">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#c8a97e]/10">
                      <p
                        className={`text-[9px] uppercase tracking-widest font-bold ${
                          product.stock > 0
                            ? "text-[#c8a97e]"
                            : "text-rose-800"
                        }`}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </p>

                      <button
                        onClick={() => {
                           if(!userId){
                          return toast.error("Please login to manage your cart");
                        }
                          addToCart(product);
                          toast.success("Added to cart");
                        }}
                        disabled={product.stock === 0}
                        className="text-[10px] uppercase tracking-[0.2em] text-white hover:text-[#c8a97e] transition-colors disabled:text-white/10"
                      >
                        [ Add to Cart ]
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="py-20 text-center">
          <div className="h-[1px] w-10 bg-[#c8a97e]/20 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default Products;