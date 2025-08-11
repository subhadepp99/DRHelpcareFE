"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Trash2 } from "lucide-react";
import AdminLayout from "../layout";

export default function AdminUsersPage() {
  const { get, put, del } = useApi();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await get("/users");
      setUsers(res.data.data?.users || res.data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (user, newRole) => {
    await put(`/users/${user._id}/role`, { role: newRole });
    fetchUsers();
  };

  const deactivateUser = async (user) => {
    if (confirm(`Are you sure you want to deactivate user ${user.username}?`)) {
      await del(`/users/${user._id}`);
      fetchUsers();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Users Management</h1>
      {loading ? (
        <p>Loading...</p>
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
                  >
                    <Trash2 className="w-5 h-5" />
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
