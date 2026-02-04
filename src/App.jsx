
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './assets/pages/user/login'
import Home from './assets/pages/user/home'
import Products from './assets/pages/user/Products'
import ProductUI from './assets/pages/user/ProductUI'
import Cart from './assets/pages/user/Cart'
import Wishlist from './assets/pages/user/Wishlist'
import Register from './assets/pages/user/Register'
import Orders from './assets/pages/user/Orders'
import Detailsandpayment from './assets/pages/user/Detailsandpayment'




function App() {


  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a140e",
            backdropBlur: "10px",
            color: "#e6c89c",
            borderRadius: "2px",
            border: "1px solid rgba(200, 169, 126, 0.2)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "16px 24px",
            fontFamily: "serif",
          },

          success: {
            iconTheme: {
              primary: "#c8a97e",
              secondary: "#1a140e"
            }
          },

          error: {
            iconTheme: {
              primary: "#991b1b",
              secondary: "#1a140e"
            }
          }
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productsUI/:id" element={<ProductUI />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/detailsandpayment" element={<Detailsandpayment />} />


      </Routes>
    </BrowserRouter>








  )
}

export default App
