"use client";

import React, { useRef, useState, useEffect, ReactNode, Children } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import CarouselDots from "./CarouselDots";

export interface CarouselProps {
   children: ReactNode;
   className?: string;
   itemsToShow?: {
      base?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
   };
   gap?: number;
   showArrows?: boolean;
   showDots?: boolean;
   autoPlay?: boolean;
   autoPlayInterval?: number;
   loop?: boolean;
}

const Carousel = ({
   children,
   className,
   itemsToShow = {
      base: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
   },
   gap = 16,
   showArrows = true,
   showDots = true,
   autoPlay = false,
   autoPlayInterval = 3000,
   loop = false,
}: CarouselProps) => {
   const childrenArray = Children.toArray(children);
   const carouselRef = useRef<HTMLDivElement>(null);
   const [currentIndex, setCurrentIndex] = useState(0);
   const [touchStart, setTouchStart] = useState(0);
   const [touchEnd, setTouchEnd] = useState(0);
   const [isDragging, setIsDragging] = useState(false);
   const [startX, setStartX] = useState(0);
   const [scrollLeft, setScrollLeft] = useState(0);

   // Calculate visible items based on screen size
   const [visibleItems, setVisibleItems] = useState(itemsToShow.base || 1);

   useEffect(() => {
      const handleResize = () => {
         const width = window.innerWidth;
         if (width >= 1280 && itemsToShow.xl) {
            setVisibleItems(itemsToShow.xl);
         } else if (width >= 1024 && itemsToShow.lg) {
            setVisibleItems(itemsToShow.lg);
         } else if (width >= 768 && itemsToShow.md) {
            setVisibleItems(itemsToShow.md);
         } else if (width >= 640 && itemsToShow.sm) {
            setVisibleItems(itemsToShow.sm);
         } else {
            setVisibleItems(itemsToShow.base || 1);
         }
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, [itemsToShow]);

   // Autoplay
   useEffect(() => {
      if (!autoPlay) return;

      const interval = setInterval(() => {
         handleNext();
      }, autoPlayInterval);

      return () => clearInterval(interval);
   }, [
      autoPlay,
      autoPlayInterval,
      currentIndex,
      childrenArray.length,
      visibleItems,
   ]);

   const scrollToIndex = (index: number) => {
      if (!carouselRef.current) return;

      let targetIndex = index;

      // Handle loop behavior
      if (loop) {
         if (index < 0) {
            targetIndex = childrenArray.length - visibleItems;
         } else if (index > childrenArray.length - visibleItems) {
            targetIndex = 0;
         }
      } else {
         // Clamp index to valid range
         targetIndex = Math.max(
            0,
            Math.min(index, childrenArray.length - visibleItems)
         );
      }

      const itemWidth = carouselRef.current.offsetWidth / visibleItems;
      carouselRef.current.scrollLeft = targetIndex * (itemWidth + gap);
      setCurrentIndex(targetIndex);
   };

   const handlePrev = () => {
      scrollToIndex(currentIndex - 1);
   };

   const handleNext = () => {
      scrollToIndex(currentIndex + 1);
   };

   const handleDotClick = (index: number) => {
      scrollToIndex(index);
   };

   // Mouse drag handlers
   const handleMouseDown = (e: React.MouseEvent) => {
      if (!carouselRef.current) return;
      setIsDragging(true);
      setStartX(e.pageX - carouselRef.current.offsetLeft);
      setScrollLeft(carouselRef.current.scrollLeft);
   };

   const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging || !carouselRef.current) return;
      e.preventDefault();
      const x = e.pageX - carouselRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      carouselRef.current.scrollLeft = scrollLeft - walk;
   };

   const handleMouseUp = () => {
      setIsDragging(false);
      if (!carouselRef.current) return;

      const itemWidth = carouselRef.current.offsetWidth / visibleItems;
      const newIndex = Math.round(
         carouselRef.current.scrollLeft / (itemWidth + gap)
      );
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
   };

   // Touch handlers
   const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
      if (carouselRef.current) {
         setScrollLeft(carouselRef.current.scrollLeft);
      }
   };

   const handleTouchMove = (e: React.TouchEvent) => {
      if (!carouselRef.current) return;

      setTouchEnd(e.targetTouches[0].clientX);
      const touchDiff = touchStart - e.targetTouches[0].clientX;
      carouselRef.current.scrollLeft = scrollLeft + touchDiff;
   };

   const handleTouchEnd = () => {
      if (!carouselRef.current) return;

      const itemWidth = carouselRef.current.offsetWidth / visibleItems;
      const newIndex = Math.round(
         carouselRef.current.scrollLeft / (itemWidth + gap)
      );
      setCurrentIndex(newIndex);
      scrollToIndex(newIndex);
   };

   // Calculate the total number of steps
   const totalSteps = Math.max(0, childrenArray.length - visibleItems + 1);

   return (
      <div className={cn("relative w-full", className)}>
         <div
            ref={carouselRef}
            className="overflow-x-hidden scroll-smooth"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
         >
            <div
               className="flex transition-transform duration-300"
               style={{ gap: `${gap}px` }}
            >
               {childrenArray.map((child, index) => (
                  <div
                     key={index}
                     className="flex-shrink-0"
                     style={{
                        width: `calc((100% - ${
                           (visibleItems - 1) * gap
                        }px) / ${visibleItems})`,
                     }}
                  >
                     {child}
                  </div>
               ))}
            </div>
         </div>

         {showArrows && totalSteps > 1 && (
            <>
               <button
                  onClick={handlePrev}
                  disabled={!loop && currentIndex === 0}
                  className={cn(
                     "absolute top-1/2 left-2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-background/80 shadow-md z-10 transition-opacity",
                     !loop && currentIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-80 hover:opacity-100"
                  )}
               >
                  <ArrowLeft size={20} />
               </button>
               <button
                  onClick={handleNext}
                  disabled={
                     !loop &&
                     currentIndex >= childrenArray.length - visibleItems
                  }
                  className={cn(
                     "absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-background/80 shadow-md z-10 transition-opacity",
                     !loop &&
                        currentIndex >= childrenArray.length - visibleItems
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-80 hover:opacity-100"
                  )}
               >
                  <ArrowRight size={20} />
               </button>
            </>
         )}

         {showDots && totalSteps > 1 && (
            <CarouselDots
               total={totalSteps}
               current={currentIndex}
               onDotClick={handleDotClick}
            />
         )}
      </div>
   );
};

export default Carousel;
