import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export default function AdminRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const id = localStorage.getItem("admin");
      const idd = JSON.parse(id)

      if (!idd) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:3001/user/${idd}`
        );

        const user = res.data;
       

        if (
          user.role &&
          user.role.toLowerCase() === "admin"
        ) {
          setIsAdmin(true);
        }

      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}