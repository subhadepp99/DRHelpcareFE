"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  UserPlus,
  Smartphone,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useApi } from "@/hooks/useApi";
import MetaTags from "@/components/common/MetaTags";
import { pageMetadata } from "@/utils/metadata";
import {
  loadMsg91Widget,
  isMsg91Configured,
  msg91SendOtp,
  msg91VerifyOtp,
  msg91RetryOtp,
  msg91ExtractReqId,
  msg91ExtractAccessToken,
} from "@/lib/msg91";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const { post, loading: apiLoading } = useApi();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: OTP verification
  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [txnId, setTxnId] = useState("");
  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");

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

  // Send OTP for verification
  const handleSendOTP = async (data) => {
    try {
      setFormData(data);
      if (isMsg91Configured()) {
        await loadMsg91Widget();
        const resp = await msg91SendOtp(String(data.phone));
        setTxnId(resp?.data?.txnId || resp?.txnId || "");
        setStep(2);
        startCountdown();
        toast.success("OTP sent successfully");
        return;
      }
      const response = await post(
        "/auth/send-registration-otp",
        {
          phone: data.phone,
        },
        {
          headers: {
            "X-Skip-Unauth-Redirect": "true",
          },
        }
      );
      if (response.data?.success) {
        setStep(2);
        startCountdown();
        toast.success("OTP sent successfully");
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
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
        } catch (e) {
          const again = await msg91SendOtp(String(formData.phone));
          setTxnId(msg91ExtractReqId(again) || "");
        }
        startCountdown();
        toast.success("OTP resent successfully");
        return;
      }
      const response = await post(
        "/auth/send-registration-otp",
        {
          phone: formData.phone,
        },
        {
          headers: {
            "X-Skip-Unauth-Redirect": "true",
          },
        }
      );
      if (response.data?.success) {
        startCountdown();
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  // Verify OTP and complete registration
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      setOtpError("Please enter the 4-digit OTP");
      return;
    }

    try {
      if (isMsg91Configured()) {
        await loadMsg91Widget();
        const vr = await msg91VerifyOtp(Number(otp), txnId || undefined);
        const accessToken = msg91ExtractAccessToken(vr);
        if (!accessToken) throw new Error("No access token from MSG91");
        const response = await post(
          "/auth/register-msg91",
          {
            accessToken,
            user: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              username: formData.username,
              password: formData.password,
              phone: formData.phone,
            },
          },
          {
            headers: {
              "X-Skip-Unauth-Redirect": "true",
            },
          }
        );
        if (response.data?.success) {
          setOtpError("");
          toast.success("Registration successful!");
          router.push("/");
        } else {
          const errorMessage =
            response.data?.message ||
            "We couldn't complete your registration right now. Please try again after some time. If the issue persists, contact the administrator.";
          setOtpError(errorMessage);
        }
        return;
      }

      const result = await registerUser({ ...formData, otp: otp });

      if (result.success) {
        setOtpError("");
        toast.success("Registration successful! Welcome to DrHelp");
        // Wait a bit before redirecting to show the success message
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        const message =
          result.message ||
          "We couldn't complete your registration right now. Please try again after some time. If the issue persists, contact the administrator.";
        setOtpError(message);
        // Don't clear OTP, let user try again
      }
    } catch (error) {
      const fallbackMessage =
        error.message ||
        "We couldn't complete your registration right now. Please try again after some time. If the issue persists, contact the administrator.";
      setOtpError(fallbackMessage);
      // Stay on the OTP screen, don't redirect
    }
  };

  const onSubmit = async (data) => {
    // Store form data and send OTP
    await handleSendOTP(data);
  };

  if (step === 2) {
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
              <Smartphone className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Verify Your Phone
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter the 4-digit OTP sent to {formData?.phone}
            </p>
          </div>

          <div className="mt-8 space-y-6">
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
                  onChange={(e) => {
                    setOtpError("");
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                  }}
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
                disabled={!otp || otp.length !== 4 || isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  "Verify & Create Account"
                )}
              </button>
              {otpError && (
                <p className="text-sm text-red-600 text-center">{otpError}</p>
              )}

              <button
                type="button"
                onClick={handleResendOTP}
                disabled={countdown > 0 || isLoading}
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
                ← Back to registration form
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={pageMetadata.register.title}
        description={pageMetadata.register.description}
        keywords={pageMetadata.register.keywords}
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
              <UserPlus className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      type="text"
                      className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                      placeholder="First Name"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      type="text"
                      className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                      placeholder="Last Name"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    type="text"
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                    placeholder="Username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Email (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email", {
                      required: false,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                    placeholder="Email (optional)"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit phone number",
                      },
                    })}
                    type="tel"
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm"
                    placeholder="Phone Number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="appearance-none relative block w-full px-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 sm:text-sm pr-12"
                    placeholder="Confirm Password"
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
                  "Send OTP & Continue"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
}
