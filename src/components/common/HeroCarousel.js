"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/utils/imageUtils";

export default function HeroCarousel({ placement = "home" }) {
  const { get } = useApi();
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await get(
          `/banners?placement=${encodeURIComponent(placement)}`
        );
        const list = res.data?.data?.banners || res.data?.banners || [];
        setBanners(list);
      } catch (e) {
        setBanners([]);
      }
    })();
  }, [get, placement]);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  if (!banners.length) return null;

  const current = banners[index];
  const onDot = (i) => setIndex(i);

  const imgUrl = getImageUrl(current.imageUrl || current.image);

  return (
    <div className="relative w-full h-40 sm:h-56 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow-lg">
      {imgUrl && (
        <Image
          src={imgUrl}
          alt={current.title || "Banner"}
          fill
          className="object-cover"
          priority
          unoptimized={imgUrl.startsWith("data:")}
        />
      )}

      {current.title && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={index}
          className="absolute bottom-3 left-3 right-3 bg-black/40 text-white px-3 py-2 rounded-md text-sm sm:text-base"
        >
          {current.title}
        </motion.div>
      )}

      {/* Dots */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {banners.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onDot(i)}
            className={`w-2.5 h-2.5 rounded-full ${
              i === index ? "bg-white" : "bg-white/60"
            }`}
          />
        ))}
      </div>
      {/* Link overlay */}
      {current.linkUrl && (
        <a
          href={current.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
        >
          <span className="sr-only">Open banner link</span>
        </a>
      )}
    </div>
  );
}
