"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/utils/imageUtils";

export default function HeroCarousel({ placement = "home" }) {
  const { get } = useApi();
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, deltaX: 0 });
  const recentlyDraggedRef = useRef(false);

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

  const restartAuto = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (banners.length > 1) {
      timerRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % banners.length);
      }, 4000);
    }
  };

  useEffect(() => {
    restartAuto();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length]);

  const goNext = () => setIndex((i) => (i + 1) % banners.length);
  const goPrev = () =>
    setIndex((i) => (i - 1 + banners.length) % banners.length);

  const onPointerDown = (e) => {
    if (banners.length <= 1) return;
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    dragRef.current.dragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.deltaX = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.deltaX = e.clientX - dragRef.current.startX;
  };

  const endDrag = () => {
    if (!dragRef.current.dragging) return;
    const delta = dragRef.current.deltaX;
    dragRef.current.dragging = false;
    dragRef.current.deltaX = 0;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goPrev();
      else goNext();
      recentlyDraggedRef.current = true;
      setTimeout(() => (recentlyDraggedRef.current = false), 200);
    }
    restartAuto();
  };

  if (!banners.length) return null;

  const current = banners[index];
  const onDot = (i) => setIndex(i);

  const imgUrl = getImageUrl(current.imageUrl || current.image);

  // Mouse event fallbacks for broader browser support
  const onMouseDown = (e) => onPointerDown(e);
  const onMouseMove = (e) => onPointerMove(e);
  const onMouseUp = () => endDrag();

  return (
    <div
      className="relative w-full h-40 sm:h-56 md:h-72 lg:h-80 rounded-xl overflow-hidden shadow-lg select-none cursor-grab"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {imgUrl && (
        <Image
          src={imgUrl}
          alt={current.title || "Banner"}
          fill
          className="object-cover"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
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

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              goPrev();
              restartAuto();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              goNext();
              restartAuto();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      {/* Link overlay */}
      {current.linkUrl && (
        <a
          href={current.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
          onClick={(e) => {
            if (recentlyDraggedRef.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
        >
          <span className="sr-only">Open banner link</span>
        </a>
      )}
    </div>
  );
}
