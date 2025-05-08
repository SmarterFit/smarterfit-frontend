import { cn } from "@/lib/utils";
import { Star, Quote } from "lucide-react";

export type TestimonialDTO = {
   name: string;
   message: string;
   rating: number;
   avatar: string;
};

type TestimonialCardProps = {
   testimonial: TestimonialDTO;
   className?: string;
};

function renderStars(rating: number) {
   const fullStars = Math.floor(rating);
   const hasHalfStar = rating % 1 >= 0.5;
   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

   const starSize = 28;

   return (
      <div className="flex gap-1">
         {/* Estrelas completas */}
         {Array.from({ length: fullStars }).map((_, i) => (
            <Star
               key={`full-${i}`}
               size={starSize}
               className="text-yellow-400 fill-yellow-400"
            />
         ))}

         {/* Estrela pela metade */}
         {hasHalfStar && (
            <div
               key="half"
               className="relative"
               style={{ width: starSize, height: starSize }}
            >
               <Star
                  size={starSize}
                  className="text-gray-300 absolute top-0 left-0"
               />
               <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${starSize / 2}px` }}
               >
                  <Star
                     size={starSize}
                     className="text-yellow-400 fill-yellow-400"
                  />
               </div>
            </div>
         )}

         {/* Estrelas vazias */}
         {Array.from({ length: emptyStars }).map((_, i) => (
            <Star
               key={`empty-${i}`}
               size={starSize}
               className="text-gray-300"
            />
         ))}
      </div>
   );
}

export default function TestimonialCard({
   testimonial,
   className,
}: TestimonialCardProps) {
   const classes = cn("card flex-col justify-start h-96 px-12 py-4", className);

   return (
      <div className={classes}>
         <div className="flex items-center justify-between w-full h-32">
            <img
               src={testimonial.avatar}
               alt={testimonial.name}
               className="w-28 h-28 rounded-full shadow-lg"
            />
            <div>
               <h3 className="text-2xl font-bold text-accent">
                  {testimonial.name}
               </h3>
               {renderStars(testimonial.rating)}
            </div>
         </div>

         <div className="relative w-full text-justify mt-4 text-sm sm:text-base">
            <Quote
               className="absolute top-[-10px] left-[-10px] text-accent/20"
               size={64}
               strokeWidth={1}
            />
            <p className="relative z-10">{testimonial.message}</p>
         </div>
      </div>
   );
}
