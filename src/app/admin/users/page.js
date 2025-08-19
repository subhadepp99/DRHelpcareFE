"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Trash2 } from "lucide-react";
import AdminLayout from "../layout";
import toast from "react-hot-toast"; // Import toast

export default function AdminUsersPage() {
  const { get, put, del } = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // New state for error messages
  const [isChangingRole, setIsChangingRole] = useState(false); // New state for role change loading
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion loading

  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const res = await get("/users");
      setUsers(res.data.data?.users || res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users.");
      setError("Failed to load user data.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (user, newRole) => {
    setIsChangingRole(true); // Set loading state for role change
    try {
      await put(`/users/${user._id}/role`, { role: newRole });
      toast.success("User role updated successfully!");
      fetchUsers(); // Re-fetch users to reflect changes
    } catch (err) {
      console.error("Failed to change user role:", err);
      toast.error(
        "Failed to change user role: " +
          (err?.response?.data?.message || err.message || "Unknown error")
      );
    } finally {
      setIsChangingRole(false); // Reset loading state
    }
  };

  const deactivateUser = async (userToDeactivate) => {
    if (
      confirm(
        `Are you sure you want to deactivate user ${userToDeactivate.username}?`
      )
    ) {
      setIsDeleting(true); // Set loading state for deletion
      try {
        await del(`/users/${userToDeactivate._id}`);
        toast.success("User deactivated successfully!");
        fetchUsers(); // Re-fetch users to reflect changes
      } catch (err) {
        console.error("Failed to deactivate user:", err);
        toast.error(
          "Failed to deactivate user: " +
            (err?.response?.data?.message || err.message || "Unknown error")
        );
      } finally {
        setIsDeleting(false); // Reset loading state
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Users Management</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <table className="w-full text-left border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Username</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Active</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">
                  {u.firstName} {u.lastName}
                </td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u, e.target.value)}
                    className="input-field"
                    disabled={isChangingRole} // Disable select while changing role
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superuser">Superuser</option>
                  </select>
                </td>
                <td className="border p-2">{u.phone}</td>
                <td className="border p-2">{u.isActive ? "Yes" : "No"}</td>
                <td className="border p-2">
                  <button
                    onClick={() => deactivateUser(u)}
                    className="text-red-600 hover:text-red-800"
                    title="Deactivate User"
                    disabled={isDeleting} // Disable delete button while deleting
                  >
                    {isDeleting ? (
                      "Deleting..."
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
