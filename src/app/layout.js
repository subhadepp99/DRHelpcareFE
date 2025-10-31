"use client";

import "./globals.css"; // FIRST import
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import { LocationProvider } from "@/contexts/LocationContext";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    setMounted(true);
    initializeAuth();
  }, [initializeAuth]);

  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>Find Doctors, Clinics & Pathology Labs in Midnapore | DrHelp.in</title>
          <meta name="description" content="DrHelp helps you find trusted doctors, clinics, pathology labs, and ambulance services in Tamluk, Haldia, Contai, and nearby areas. Book medical services easily and get care when you need it most." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="fast2sms" content="pdVH66wTFsGd4GOM811gavI2ReWPGnpq" />
        </head>
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="spinner w-8 h-8"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Find Doctors, Clinics & Pathology Labs in Midnapore | DrHelp.in</title>
        <meta name="description" content="DrHelp helps you find trusted doctors, clinics, pathology labs, and ambulance services in Tamluk, Haldia, Contai, and nearby areas. Book medical services easily and get care when you need it most." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="fast2sms" content="pdVH66wTFsGd4GOM811gavI2ReWPGnpq" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <LocationProvider>
              {children}
              <FloatingContactButtons />
            </LocationProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
              }}
            />
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
