"use client";

import "./globals.css"; // FIRST import
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import { LocationProvider, useLocation } from "@/contexts/LocationContext";
import LocationModal from "@/components/modals/LocationModal";

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to handle mandatory location modal
function LocationModalWrapper() {
  const {
    location,
    setLocation,
    isLocationModalOpen,
    closeLocationModal,
    isInitialized,
  } = useLocation();
  const isMandatory = !location && isLocationModalOpen;

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
    closeLocationModal();
  };

  // Don't render until initialized to avoid flash
  if (!isInitialized) {
    return null;
  }

  return (
    <LocationModal
      isOpen={isLocationModalOpen}
      onClose={isMandatory ? undefined : closeLocationModal}
      onLocationSelect={handleLocationSelect}
      mandatory={isMandatory}
    />
  );
}

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
          <title>
            Find Doctors, Clinics & Pathology Labs in Midnapore | DrHelp.in
          </title>
          <link rel="icon" href="/images/logo.png" type="image/png" />
          <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
          <link rel="apple-touch-icon" href="/images/logo.png" />
          <meta
            name="description"
            content="DrHelp helps you find trusted doctors, clinics, pathology labs, and ambulance services in Tamluk, Haldia, Contai, and nearby areas. Book medical services easily and get care when you need it most."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="fast2sms" content="pdVH66wTFsGd4GOM811gavI2ReWPGnpq" />
          <meta
            name="google-site-verification"
            content="Sb0LAXuh7dfZaO7VE7VO82ywyM3K4eMCRNOiJNFo8wA"
          />
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MWQPKM9H');`,
            }}
          />
          {/* End Google Tag Manager */}
          {/* Google Analytics */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-QTCTZFJHCG"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QTCTZFJHCG');
            `,
            }}
          />
        </head>
        <body className={inter.className}>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-MWQPKM9H"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
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
        <title>
          Find Doctors, Clinics & Pathology Labs in Midnapore | DrHelp.in
        </title>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta
          name="description"
          content="DrHelp helps you find trusted doctors, clinics, pathology labs, and ambulance services in Tamluk, Haldia, Contai, and nearby areas. Book medical services easily and get care when you need it most."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="fast2sms" content="pdVH66wTFsGd4GOM811gavI2ReWPGnpq" />
        <meta
          name="google-site-verification"
          content="Sb0LAXuh7dfZaO7VE7VO82ywyM3K4eMCRNOiJNFo8wA"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MWQPKM9H');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-QTCTZFJHCG"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QTCTZFJHCG');
          `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MWQPKM9H"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <LocationProvider>
              {children}
              <FloatingContactButtons />
              <LocationModalWrapper />
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
