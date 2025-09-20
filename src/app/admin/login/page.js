"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useApi } from "@/hooks/useApi";
import {
  loadMsg91Widget,
  isMsg91Configured,
  msg91SendOtp,
  msg91VerifyOtp,
  msg91RetryOtp,
  msg91ExtractReqId,
  msg91ExtractAccessToken,
} from "@/lib/msg91";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, initialize } = useAuthStore();
  const { post, loading: apiLoading } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [otpStep, setOtpStep] = useState(1); // 1: send OTP, 2: verify OTP
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [txnId, setTxnId] = useState("");
  const [verifyError, setVerifyError] = useState("");

  // Hardcode loginType to 'admin' for this page
  const loginType = "admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Send OTP for login
  const handleSendOTP = async (data) => {
    try {
      setVerifyError("");
      const normalized = String(data.identifier || "").trim();
      if (!normalized) {
        toast.error("Please enter your registered phone number");
        return;
      }
      setIdentifier(normalized);
      if (isMsg91Configured()) {
        await loadMsg91Widget();
        const resp = await msg91SendOtp(normalizePhoneForMsg91(normalized));
        setTxnId(
          resp?.data?.txnId || resp?.txnId || msg91ExtractReqId(resp) || ""
        );
        setOtpStep(2);
        startCountdown();
        toast.success("OTP sent successfully");
        return;
      }
      const response = await post("/auth/send-login-otp", {
        identifier: normalized,
      });
      if (response.data?.success) {
        setOtpStep(2);
        startCountdown();
        toast.success("OTP sent successfully to your registered phone number");
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  function normalizePhoneForMsg91(value) {
    const str = String(value || "").trim();
    if (str.includes("@")) return str; // email
    let digits = str.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 11)
      digits = digits.slice(1);
    if (digits.startsWith("91")) return digits;
    if (digits.length === 10) return `91${digits}`;
    return digits;
  }

  // Verify OTP and login
  const handleVerifyOTP = async () => {
    const isWidget = isMsg91Configured();
    const isValidLength = isWidget
      ? otp && (otp.length === 4 || otp.length === 6)
      : otp && otp.length === 6;
    if (!isValidLength) {
      toast.error(
        isWidget
          ? "Enter a 4 or 6-digit OTP"
          : "Please enter a valid 6-digit OTP"
      );
      return;
    }

    try {
      setVerifyError("");
      if (isWidget) {
        await loadMsg91Widget();
        const vr = await msg91VerifyOtp(String(otp), txnId || undefined);
        const accessToken = msg91ExtractAccessToken(vr);
        if (!accessToken) throw new Error("No access token from MSG91");
        const response = await post(
          "/auth/login-msg91",
          { identifier },
          { headers: { "X-Skip-Unauth-Redirect": "1" } }
        );
        if (response.data?.success) {
          const payload = response.data?.data || {};
          const token = payload.token;
          const user = payload.user;
          if (token && user && typeof window !== "undefined") {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            try {
              if (typeof initialize === "function") initialize();
            } catch (_) {}
          }
          const role = user?.role || response.data?.data?.user?.role;
          if (
            [
              "admin",
              "superuser",
              "masteruser",
              "userDoctor",
              "userClinic",
            ].includes(role)
          ) {
            router.push("/admin");
            toast.success("Admin login successful!");
          } else {
            toast.error("Insufficient permissions for admin access");
          }
        } else {
          const failMsg = response.data?.message || "Login failed";
          setVerifyError(failMsg);
        }
        return;
      }
      const response = await post(
        "/auth/verify-otp-login",
        { identifier, otp },
        { headers: { "X-Skip-Unauth-Redirect": "1" } }
      );
      if (response.data?.success) {
        const payload = response.data?.data || {};
        const token = payload.token;
        const user = payload.user;
        if (token && user && typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          try {
            if (typeof initialize === "function") initialize();
          } catch (_) {}
        }
        const role = (payload.user && payload.user.role) || user?.role;
        if (
          [
            "admin",
            "superuser",
            "masteruser",
            "userDoctor",
            "userClinic",
          ].includes(role)
        ) {
          router.push("/admin");
          toast.success("Admin login successful!");
        } else {
          toast.error("Insufficient permissions for admin access");
        }
      } else {
        const msg = response.data?.message || "Login failed";
        setVerifyError(msg);
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      const msg = error.response?.data?.message || error.message;
      setVerifyError(msg || "Login failed. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    try {
      if (isMsg91Configured()) {
        await loadMsg91Widget();
        try {
          const resp = await msg91RetryOtp(null, txnId || undefined);
          setTxnId(msg91ExtractReqId(resp) || txnId || "");
        } catch (_) {
          const again = await msg91SendOtp(String(identifier));
          setTxnId(msg91ExtractReqId(again) || "");
        }
        startCountdown();
        toast.success("OTP resent successfully");
        return;
      }
      const response = await post("/auth/send-login-otp", {
        identifier,
      });
      if (response.data?.success) {
        startCountdown();
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = await login({
        identifier: data.identifier,
        password: data.password,
      });

      if (result.success) {
        if (["admin", "superuser"].includes(result.user.role)) {
          router.push("/admin");
          toast.success("Admin login successful!");
        } else {
          toast.error("Insufficient permissions for admin access");
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-12 w-12 bg-primary-600 rounded-full flex items-center justify-center"
          >
            <Shield className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access admin panel |{" "}
            <Link
              href="/"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Back to main website
            </Link>
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="mt-6">
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 p-1 bg-gray-50 dark:bg-gray-700">
            <button
              type="button"
              onClick={() => setLoginMethod("password")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginMethod === "password"
                  ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                loginMethod === "otp"
                  ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-2" />
              OTP
            </button>
          </div>
        </div>

        {/* Password Login Form */}
        {loginMethod === "password" && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              {/* Identifier Field */}
              <div>
                <label htmlFor="identifier" className="sr-only">
                  Email, Username or Phone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("identifier", {
                      required: "Email, username or phone is required",
                    })}
                    type="text"
                    autoComplete="username"
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                    placeholder="Email, username or phone"
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm pr-12"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  "Sign in as Admin"
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* OTP Login Form */}
        {loginMethod === "otp" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-6"
          >
            {otpStep === 1 ? (
              // Step 1: Send OTP
              <form
                onSubmit={handleSubmit(handleSendOTP)}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="otp-identifier" className="sr-only">
                    Enter your registered phone number.
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("identifier", {
                        required: "Registered phone is required",
                      })}
                      type="text"
                      autoComplete="username"
                      className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                      placeholder="Enter your registered phone number."
                    />
                  </div>
                  {errors.identifier && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {apiLoading ? <div className="spinner"></div> : "Send OTP"}
                  </button>
                </div>
              </form>
            ) : (
              // Step 2: Verify OTP
              <div className="space-y-6">
                <div>
                  <label htmlFor="otp" className="sr-only">
                    OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      maxLength={6}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleVerifyOTP();
                        }
                      }}
                      className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm text-center text-lg tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                    {isMsg91Configured()
                      ? "Enter the OTP sent to your phone"
                      : "Enter the 6-digit OTP sent to your phone"}
                  </p>
                </div>

                <div className="space-y-4">
                  {verifyError && (
                    <div className="w-full text-center text-red-600 text-sm font-medium">
                      {verifyError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={!otp || apiLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {apiLoading ? (
                      <div className="spinner"></div>
                    ) : (
                      "Verify OTP & Login"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || apiLoading}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setOtpStep(1)}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    ← Back to previous step
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
