"use client";

import { useEffect } from "react";

export default function MetaTags({ 
  title, 
  description, 
  keywords, 
  canonical, 
  ogImage,
  structuredData,
  author,
  doctorName,
  location,
  specialty 
}) {
  useEffect(() => {
    const siteName = "DrHelp.in";
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://drhelp.in';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : baseUrl;
    const canonicalUrl = canonical || currentUrl;
    
    // Update document title
    if (title) {
      document.title = title;
    }
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector, attribute, value) => {
      if (!value) return;
      
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (attribute === 'property') {
          element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        } else {
          element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };
    
    // Helper function to update or create link tag
    const updateLinkTag = (rel, href) => {
      if (!href) return;
      
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };
    
    // Primary Meta Tags
    updateMetaTag('meta[name="title"]', 'name', title);
    updateMetaTag('meta[name="description"]', 'name', description);
    if (keywords) updateMetaTag('meta[name="keywords"]', 'name', keywords);
    
    // Doctor-specific Meta Tags
    if (doctorName) {
      updateMetaTag('meta[name="doctor:name"]', 'name', doctorName);
      updateMetaTag('meta[name="author"]', 'name', doctorName);
    }
    if (location) updateMetaTag('meta[name="doctor:location"]', 'name', location);
    if (specialty) updateMetaTag('meta[name="doctor:specialty"]', 'name', specialty);
    
    // Canonical URL
    updateLinkTag('canonical', canonicalUrl);
    
    // Open Graph / Facebook
    updateMetaTag('meta[property="og:type"]', 'property', 'website');
    updateMetaTag('meta[property="og:url"]', 'property', canonicalUrl);
    updateMetaTag('meta[property="og:title"]', 'property', title);
    updateMetaTag('meta[property="og:description"]', 'property', description);
    updateMetaTag('meta[property="og:site_name"]', 'property', siteName);
    if (ogImage) updateMetaTag('meta[property="og:image"]', 'property', ogImage);
    
    // Twitter
    updateMetaTag('meta[property="twitter:card"]', 'property', 'summary_large_image');
    updateMetaTag('meta[property="twitter:url"]', 'property', canonicalUrl);
    updateMetaTag('meta[property="twitter:title"]', 'property', title);
    updateMetaTag('meta[property="twitter:description"]', 'property', description);
    if (ogImage) updateMetaTag('meta[property="twitter:image"]', 'property', ogImage);
    
    // Additional Meta Tags
    updateMetaTag('meta[name="robots"]', 'name', 'index, follow');
    updateMetaTag('meta[name="language"]', 'name', 'English');
    
    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]');
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(structuredData);
    }
    
  }, [title, description, keywords, canonical, ogImage, structuredData, author, doctorName, location, specialty]);
  
  return null;
}

