"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Smartphone, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { post, loading: apiLoading } = useApi();
  const [step, setStep] = useState(1); // 1: identifier, 2: OTP, 3: new password
  const [loginAfterOtp, setLoginAfterOtp] = useState(true);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

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

  // Step 1: Send OTP
  const handleSendOTP = async (data) => {
    try {
      const response = await post("/auth/send-password-reset-otp", {
        identifier: data.identifier,
      });

      if (response.data?.success) {
        setIdentifier(data.identifier);
        setStep(2);
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

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      toast.error("Enter the 4-digit OTP");
      return;
    }

    try {
      if (loginAfterOtp) {
        const response = await post("/auth/verify-otp-login", {
          identifier,
          otp,
        });
        if (response.data?.success) {
          toast.success(
            "Logged in successfully. You can change password in profile."
          );
          router.push("/profile");
        } else {
          toast.error(response.data?.message || "Invalid OTP");
        }
      } else {
        const response = await post("/auth/reset-password-otp", {
          identifier,
          otp,
          newPassword: "temp",
        });
        if (response.data?.success) {
          setStep(3);
          toast.success(
            "OTP verified successfully. Please set your new password."
          );
        } else {
          toast.error(response.data?.message || "Invalid OTP");
        }
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  // Step 3: Set new password
  const handleSetNewPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await post("/auth/reset-password-otp", {
        identifier,
        otp,
        newPassword: data.newPassword,
      });

      if (response.data?.success) {
        toast.success("Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(response.data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    try {
      const response = await post("/auth/send-password-reset-otp", {
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

  return (
    <>
      <MetaTags
        title={pageMetadata.forgotPassword.title}
        description={pageMetadata.forgotPassword.description}
        keywords={pageMetadata.forgotPassword.keywords}
      />
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
            <Lock className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Set New Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {step === 1 &&
              "Enter your email, username, or phone to receive an OTP"}
            {step === 2 && "Enter the 6-digit OTP sent to your phone"}
            {step === 3 && "Enter your new password"}
          </p>
        </div>

        {/* Step 1: Enter Identifier */}
        {step === 1 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(handleSendOTP)}
          >
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

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={loginAfterOtp}
                onChange={(e) => setLoginAfterOtp(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Login after OTP (skip password reset now)
              </span>
            </label>

            <div>
              <button
                type="submit"
                disabled={apiLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {apiLoading ? <div className="spinner"></div> : "Send OTP"}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Back to Login
              </Link>
            </div>
          </motion.form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-6"
          >
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
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  maxLength={4}
                  className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm text-center text-lg tracking-widest"
                  placeholder="0000"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Enter the 4-digit OTP sent to your phone
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleVerifyOTP}
                disabled={!otp || otp.length !== 4 || apiLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {apiLoading ? <div className="spinner"></div> : "Verify OTP"}
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
                onClick={() => setStep(1)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                ← Back to previous step
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit(handleSetNewPassword)}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="sr-only">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm pr-12"
                    placeholder="New Password"
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
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === newPassword || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm pr-12"
                    placeholder="Confirm New Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={apiLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {apiLoading ? (
                  <div className="spinner"></div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setStep(2)}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                ← Back to OTP verification
              </button>
            </div>
          </motion.form>
        )}

        {/* Progress Indicator */}
        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  step >= stepNumber
                    ? "bg-primary-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
      </div>
    </>
  );
}
