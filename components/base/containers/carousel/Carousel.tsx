"use client";

import React, { useEffect, useRef, useState } from "react";

type CarouselProps = {
  children: React.ReactNode[];
};

export default function Carousel({ children }: CarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startPageX, setStartPageX] = useState(0);
  const [startScrollLeft, setStartScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const dragThreshold = 5;

  // Atualiza o índice ativo conforme o scroll
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Se estiver quase no começo, força o índice 0
      if (container.scrollLeft < 10) {
        setActiveIndex(0);
        return;
      }
      const childrenArray = Array.from(container.children) as HTMLElement[];
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      const closestIndex = childrenArray.reduce((prevIndex, child, index) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2;
        return Math.abs(childCenter - containerCenter) <
          Math.abs(
            childrenArray[prevIndex].offsetLeft +
              childrenArray[prevIndex].clientWidth / 2 -
              containerCenter
          )
          ? index
          : prevIndex;
      }, 0);
      setActiveIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [children]);

  // Inicia o drag e guarda a posição inicial
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = carouselRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartPageX(e.pageX);
    setStartScrollLeft(container.scrollLeft);
    setDragDistance(0);
  };

  // Atualiza o scroll enquanto arrasta
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = carouselRef.current;
    if (!container) return;
    const currentPageX = e.pageX;
    const walk = currentPageX - startPageX;
    setDragDistance(Math.abs(walk));
    container.scrollLeft = startScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Rola suavemente até o item do índice informado
  const scrollToIndex = (index: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const child = container.children[index] as HTMLElement;
    if (child) {
      container.scrollTo({
        left: child.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="carousel-container">
      <div
        ref={carouselRef}
        className="carousel-scroll hide-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={`carousel-item ${isDragging ? "pointer-events-none" : ""}`}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="carousel-pagination">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`carousel-dot ${activeIndex === index ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
