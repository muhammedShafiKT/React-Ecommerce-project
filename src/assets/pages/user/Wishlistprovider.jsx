import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

 
  const getUserId = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const fetchWishlist = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    }
  };

  
  const addToWishlist = async (product) => {
    const userId = getUserId();
    if (!userId) return alert("Login first");

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      const userData = res.data;
      const currentWishlist = userData.wishlist || [];

     
      if (currentWishlist.some(item => item.productId === product.id)) {
        return;
      }

      const updatedWishlist = [
        ...currentWishlist,
        {
          productId: product.id,
          description: product.description,
          price: product.price,
          images: product.images,
          qty: 1
        }
      ];

      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        { wishlist: updatedWishlist }
      );

      setWishlist(updatedWishlist);

    } catch (err) {
      console.error("Add wishlist error:", err);
    }
  };

 
  const removeItemFromWishlist = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      const userData = res.data;

      const updatedWishlist = (userData.wishlist || []).filter(
        item => item.productId !== productId
      );

      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        { wishlist: updatedWishlist }
      );

      setWishlist(updatedWishlist);

    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeItemFromWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
