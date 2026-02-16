import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const usersRes = await axios.get("http://localhost:3001/user"); 

        setUsers(usersRes.data);

        const flattenedOrders = usersRes.data.flatMap(user =>
          Array.isArray(user.orders)
            ? user.orders.map(order => ({
                ...order,
                userId: user.id,
                userName: user.name,
                userEmail: user.email
              }))
            : []
        );

        const sortedOrders = flattenedOrders.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setAllOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);


  const updateOrderStatus = async (orderId, userId, newStatus) => {
    try {
      
      const { data: freshUser } = await axios.get(
        `http://localhost:3001/user/${userId}`   
      );

      const updatedOrders = freshUser.orders.map(order =>
        order.orderId === orderId
          ? { ...order, status: newStatus }
          : order
      );

      const updatedUser = {
        ...freshUser,
        orders: updatedOrders
      };

      
      await axios.put(
        `http://localhost:3001/user/${userId}`,  
        updatedUser
      );

   
      setAllOrders(prev =>
        prev.map(o =>
          o.orderId === orderId
            ? { ...o, status: newStatus }
            : o
        )
      );

    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status in database");
    }
  };

  if (loading) return <h2>Loading orders...</h2>;
  if (error) return <h2 className="text-red-400">Error: {error}</h2>;

  return (
    <div className="space-y-8 text-[#e6c89c]">
      <h2 className="text-2xl tracking-widest uppercase font-serif">
        All Orders
      </h2>

      <div className="border border-[#c8a97e]/20 bg-[#1a140e]/60 p-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#c8a97e]/20">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Email</th>
              <th className="p-2">Date</th>
              <th className="p-2">Total</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {allOrders.map(order => (
              <tr key={order.orderId} className="border-b border-[#c8a97e]/10">
                <td className="p-2 font-mono">{order.orderId}</td>
                <td className="p-2">{order.customer?.name || "—"}</td>
                <td className="p-2 text-xs">{order.customer?.email || "—"}</td>
                <td className="p-2">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="p-2 font-semibold">
                  ₹{order.total.toLocaleString()}
                </td>

                <td className="p-2">
                  <select
                    value={order.status || "Processing"}
                    onChange={(e) =>
                      updateOrderStatus(
                        order.orderId,
                        order.userId,
                        e.target.value
                      )
                    }
                    className="bg-[#1a140e] border border-[#c8a97e]/20 text-[#e6c89c] p-1 rounded"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allOrders.length === 0 && (
        <p className="text-center text-[#c8a97e]/60">
          No orders found.
        </p>
      )}
    </div>
  );
}