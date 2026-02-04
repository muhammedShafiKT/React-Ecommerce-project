import axios from "axios";
import { useEffect, useState, createContext, useContext } from "react";
import toast from "react-hot-toast";


const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const Cartprovider = ({ children }) => {

  const [cart, setCart] = useState([]);

  
  const getUserId = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  
  const fetchCart = async () => {
    const userId = getUserId();

   
    
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      setCart(res.data.cart || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  
  const addToCart = async (product) => {
    const userId = getUserId();

    if (!userId) return alert("Login first");

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      let userData = res.data;
      let cart = userData.cart || [];

      let existing = cart.find(
        item => item.productId === product.id
      );

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          productId: product.id,
          description: product.description,
          price: product.price,
          images: product.images,
          qty: 1
        });
      }

      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        { cart }
      );

      fetchCart();

    } catch (err) {
      console.error("Add cart error:", err);
    }
  };

  
  const increaseQty = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      let userData = res.data;
      let cart = userData.cart || [];

      cart = cart.map(item =>
        item.productId === productId
          ? { ...item, qty: item.qty + 1 }
          : item
      );

      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        { cart }
      );

      fetchCart();

    } catch (err) {
      console.error("Increase qty error:", err);
    }
  };

  
  const decreaseQty = async (productId) => {
  const userId = getUserId();
  if (!userId) return;

  try {
    const res = await axios.get(
      `http://localhost:3001/user/${userId}`
    );

    let cart = res.data.cart || [];

    cart = cart.map(item => {
      if (item.productId === productId) {
      
        if (item.qty === 1) return item;
        return { ...item, qty: item.qty - 1 };
      }
      return item;
    });

    await axios.patch(
      `http://localhost:3001/user/${userId}`,
      { cart }
    );

    fetchCart();
  } catch (err) {
    console.error("Decrease qty error:", err);
  }
};



  const removeItem = async (productId) => {
    const userId = getUserId();
    if (!userId) return;

    try {
      const res = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      let userData = res.data;
      let cart = userData.cart || [];

      cart = cart.filter(
        item => item.productId !== productId
      );

      await axios.patch(
        `http://localhost:3001/user/${userId}`,
        { cart }
      );

      fetchCart();

    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      setCart,
      addToCart,
      increaseQty,
      decreaseQty,
      removeItem
    }}>
      {children}
    </CartContext.Provider>
  );
};
