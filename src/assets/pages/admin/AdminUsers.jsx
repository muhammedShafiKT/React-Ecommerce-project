import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get("http://localhost:3001/user");
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

 
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { data: freshUser } = await axios.get(
        `http://localhost:3001/user/${userId}`
      );

      const newStatus =
        currentStatus === "active" ? "blocked" : "active";

      const updatedUser = {
        ...freshUser,
        status: newStatus
      };

      await axios.put(
        `http://localhost:3001/user/${userId}`,
        updatedUser
      );

      setUsers(prev =>
        prev.map(u =>
          u.id === userId
            ? { ...u, status: newStatus }
            : u
        )
      );

  
      alert(
        newStatus === "blocked"
          ? "User has been BLOCKED successfully."
          : "User has been UNBLOCKED successfully."
      );

    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update user status. Try again.");
    }
  };

  if (loading) return <h2>Loading users...</h2>;
  if (error) return <h2 className="text-red-400">Error: {error}</h2>;

  return (
    <div className="space-y-8 text-[#e6c89c]">
      <h2 className="text-2xl tracking-widest uppercase font-serif">
        All Users
      </h2>

      <div className="border border-[#c8a97e]/20 bg-[#1a140e]/60 p-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#c8a97e]/20">
              <th className="p-2">User ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-[#c8a97e]/10">
                <td className="p-2 font-mono">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2 text-xs">{user.email}</td>

                <td className="p-2 font-semibold capitalize">
                  {user.role}
                </td>

             
                <td className="p-2">
                  <span
                    className={
                      user.status === "active"
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {user.status}
                  </span>
                </td>

              
                <td className="p-2">
                  {user.role === "user" && (
                    <button
                      onClick={() =>
                        toggleUserStatus(user.id, user.status)
                      }
                      className="px-3 py-1 text-xs rounded border border-[#c8a97e]/30"
                    >
                      {user.status === "active"
                        ? "Block "
                        : "Unblock "}
                    </button>
                  )}

                  {user.role !== "user" && (
                    <span className="text-gray-500 text-xs">
                      No action
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="text-center text-[#c8a97e]/60">
          No users found.
        </p>
      )}
    </div>
  );
}