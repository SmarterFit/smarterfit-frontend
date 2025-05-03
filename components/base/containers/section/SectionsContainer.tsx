"use client";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SectionsContainerProps = {
   children: React.ReactNode;
   className?: string;
};

const baseStyles = "sections-container custom-scroll";

export default function SectionsContainer({
   children,
   className,
}: SectionsContainerProps) {
   const classes = cn(baseStyles, className);
   const containerRef = useRef<HTMLDivElement>(null);
   const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
   const [isAnimating, setIsAnimating] = useState(false);

   useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const sections = container.querySelectorAll<HTMLElement>(".section");

      function handleWheel(event: WheelEvent) {
         event.preventDefault();

         if (isAnimating) return;
         const threshold = 50;

         if (
            event.deltaY > threshold &&
            currentSectionIndex < sections.length - 1
         ) {
            setIsAnimating(true);
            const nextIndex = currentSectionIndex + 1;
            sections[nextIndex].scrollIntoView({ behavior: "smooth" });
            setCurrentSectionIndex(nextIndex);
            setTimeout(() => setIsAnimating(false), 800);
         } else if (event.deltaY < -threshold && currentSectionIndex > 0) {
            setIsAnimating(true);
            const prevIndex = currentSectionIndex - 1;
            sections[prevIndex].scrollIntoView({ behavior: "smooth" });
            setCurrentSectionIndex(prevIndex);
            setTimeout(() => setIsAnimating(false), 800);
         }
      }

      container.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
         container.removeEventListener("wheel", handleWheel);
      };
   }, [currentSectionIndex, isAnimating]);

   return (
      <div ref={containerRef} className={classes}>
         {children}
      </div>
   );
}
