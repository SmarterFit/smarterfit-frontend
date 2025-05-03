import React from "react";
import { cn } from "@/lib/utils";
import { CircleDot } from "lucide-react";

interface CarouselDotsProps {
   total: number;
   current: number;
   onDotClick: (index: number) => void;
   className?: string;
}

const CarouselDots = ({
   total,
   current,
   onDotClick,
   className,
}: CarouselDotsProps) => {
   return (
      <div className={cn("flex justify-center mt-4 gap-2", className)}>
         {Array.from({ length: total }).map((_, index) => (
            <button
               key={index}
               onClick={() => onDotClick(index)}
               className={cn(
                  "transition-all duration-300 flex items-center justify-center h-8 w-8",
                  "focus:outline-none"
               )}
               aria-label={`Go to slide ${index + 1}`}
            >
               <div
                  className={cn(
                     "w-3 h-3 rounded-full transition-all duration-300",
                     index === current
                        ? "bg-accent scale-100"
                        : "bg-gray-300 scale-75 hover:scale-90"
                  )}
               />
            </button>
         ))}
      </div>
   );
};

export default CarouselDots;
