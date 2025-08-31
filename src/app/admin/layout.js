"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  Pill,
  UserPlus,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  TestTube,
  Building,
  ChevronDown,
  User,
  Truck,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getEntityImageUrl } from "@/utils/imageUtils";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/login");
    } else if (
      isAuthenticated === true &&
      !["admin", "superuser", "masteruser"].includes(user?.role)
    ) {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Doctors", href: "/admin/doctors", icon: Stethoscope },
    { name: "Departments", href: "/admin/departments", icon: Building },
    { name: "Clinics", href: "/admin/clinics", icon: Building2 },
    // { name: "Pharmacies", href: "/admin/pharmacies", icon: Pill },
    { name: "Pathology", href: "/admin/pathology", icon: TestTube },
    { name: "Ambulances", href: "/admin/ambulances", icon: Truck },
    { name: "Patients", href: "/admin/patients", icon: UserPlus },
    { name: "Users", href: "/admin/users", icon: Users },
    ...(user?.role === "superuser" || user?.role === "masteruser"
      ? [
          {
            name: "Access Requests",
            href: "/admin/access-requests",
            icon: UserPlus,
          },
        ]
      : []),
    ...(user?.role === "superuser"
      ? [{ name: "Settings", href: "/admin/settings", icon: Settings }]
      : []),
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const getPageTitle = () => {
    const segments = pathname.split("/");
    for (let i = segments.length; i >= 2; i--) {
      const testPath = segments.slice(0, i).join("/") || "/";
      const found = navigation.find((item) => item.href === testPath);
      if (found) return found.name;
    }
    return "Dashboard";
  };

  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }
  if (!["admin", "superuser"].includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Access denied.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-primary-600">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-primary-700"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                        isActive
                          ? "text-primary-600 dark:text-primary-300"
                          : "text-gray-400 group-hover:text-primary-500"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {/* Main panel */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sm:px-8">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-400 rounded-md lg:hidden hover:text-gray-500 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              <Home className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Role Display */}
            <div className="hidden sm:flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {user?.role || "User"}
              </span>
            </div>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-primary-100 dark:bg-primary-900 rounded-md select-none hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={getEntityImageUrl(user, "profileImageUrl")}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-primary-600 rounded-full uppercase">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </span>
                )}
                <span className="text-sm font-medium text-primary-800 dark:text-primary-200">
                  {user?.firstName}
                </span>
                <ChevronDown className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  {user?.role === "superuser" && (
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Close dropdown when clicking outside */}
            {userMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setUserMenuOpen(false)}
              />
            )}
          </div>
        </header>
        {/* *** FIXED PADDING *** */}
        <main className="flex-1 w-full max-w-full px-2 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
