"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/api";
import Modal from "@/components/common/Modal";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const roles = ["appuser", "admin", "superuser"];

const initialForm = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "appuser",
  password: "",
};

export default function AdminAppUsersPage() {
  const { get, post, put, del } = useApi();
  const { user: currentUser } = useAuthStore();

  const [appusers, setAppUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [requestingAdmin, setRequestingAdmin] = useState(false);

  useEffect(() => {
    fetchAppUsers();
  }, []);

  async function fetchAppUsers() {
    setLoading(true);
    try {
      const res = await get("/appusers");
      setAppUsers(res.data?.appusers || []);
    } catch {
      setAppUsers([]);
    }
    setLoading(false);
  }

  // Permissions
  const canEditRole = (role) => {
    if (currentUser.role === "superuser") return true;
    if (currentUser.role === "admin")
      return role === "appuser" || role === "admin";
    return false;
  };
  const canRemove = (appuser) => {
    if (currentUser.role === "superuser") return true;
    if (currentUser.role === "admin") return appuser.role === "appuser";
    return false;
  };
  const canAddSuperuser = currentUser.role === "superuser";

  function openAdd(roleToAdd) {
    setForm({ ...initialForm, role: roleToAdd || "appuser" });
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(appuser) {
    setEditing(appuser);
    setForm({
      username: appuser.username || "",
      firstName: appuser.firstName || "",
      lastName: appuser.lastName || "",
      email: appuser.email || "",
      phone: appuser.phone || "",
      role: appuser.role || "appuser",
      password: "",
    });
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure to delete this appuser?")) return;
    await del(`/appusers/${id}`);
    setAppUsers((prev) => prev.filter((u) => u._id !== id));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    // Superuser logic
    if (form.role === "superuser" && !canAddSuperuser) {
      alert("Only superusers can create another superuser!");
      return;
    }
    try {
      if (editing) {
        await put(`/appusers/${editing._id}`, payload);
        setAppUsers((prev) =>
          prev.map((u) => (u._id === editing._id ? { ...u, ...payload } : u))
        );
      } else {
        const res = await post("/appusers", payload);
        setAppUsers((prev) => [...prev, res.data]);
      }
      setModalOpen(false);
    } catch (err) {
      alert("Could not save: " + err.message);
    }
  }

  // Appuser view: Only see list, can request admin access
  if (currentUser.role === "appuser") {
    return (
      <div className="max-w-2xl mx-auto pt-8">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <ul>
          <li>
            <b>Name:</b> {currentUser.firstName} {currentUser.lastName}
          </li>
          <li>
            <b>Email:</b> {currentUser.email}
          </li>
          <li>
            <b>Username:</b> {currentUser.username}
          </li>
          <li>
            <b>Role:</b> {currentUser.role}
          </li>
          <li>
            <b>Phone:</b> {currentUser.phone}
          </li>
        </ul>
        <button
          onClick={async () => {
            setRequestingAdmin(true);
            try {
              await post(`/appusers/request-admin`, {});
              alert("Request submitted!");
            } catch (e) {
              alert("Error: " + e.message);
            }
            setRequestingAdmin(false);
          }}
          disabled={requestingAdmin}
          className="mt-8 btn-primary px-6 py-2"
        >
          Request Admin Access
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-xl font-bold">AppUsers Management</h1>
        <div className="space-x-2">
          {(currentUser.role === "superuser" ||
            currentUser.role === "admin") && (
            <>
              <button
                className="btn-primary"
                onClick={() => openAdd("appuser")}
              >
                <UserPlus className="w-4 h-4 mr-1 inline" /> Add AppUser
              </button>
              <button className="btn-primary" onClick={() => openAdd("admin")}>
                <UserPlus className="w-4 h-4 mr-1 inline" /> Add Admin
              </button>
              {canAddSuperuser && (
                <button
                  className="btn-primary"
                  onClick={() => openAdd("superuser")}
                >
                  <UserPlus className="w-4 h-4 mr-1 inline" /> Add Superuser
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <table className="w-full border-collapse border mb-8">
        <thead>
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appusers.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50">
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">{u.phone}</td>
              <td className="border p-2 space-x-2">
                {canEditRole(u.role) && currentUser.role !== "appuser" && (
                  <>
                    <button
                      className="text-blue-600"
                      onClick={() => openEdit(u)}
                    >
                      <Edit className="inline-block w-5 h-5" />
                    </button>
                    {canRemove(u) && (
                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(u._id)}
                      >
                        <Trash2 className="inline-block w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <Modal
          title={editing ? "Edit AppUser" : "Add AppUser"}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Username"
              className="input-field"
            />
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="First Name"
              className="input-field"
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Last Name"
              className="input-field"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              type="email"
              placeholder="Email"
              className="input-field"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Phone"
              className="input-field"
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={!canAddSuperuser && form.role === "superuser"}
              className="input-field"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder={
                editing ? "Leave blank to keep old password" : "Password"
              }
              className="input-field"
            />
            <button type="submit" className="btn-primary w-full">
              {editing ? "Update" : "Add"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
