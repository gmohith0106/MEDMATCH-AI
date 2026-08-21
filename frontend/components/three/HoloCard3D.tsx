'use client';

import React, { useState, useRef, MouseEvent, ReactNode } from 'react';

interface HoloCard3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'pink' | 'cyan' | 'emerald' | 'amber';
  depth?: number;
}

export function HoloCard3D({
  children,
  className = '',
  glowColor = 'pink',
  depth = 20,
}: HoloCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY, opacity: 0.25 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowStyles = {
    pink: 'border-[#e3577c]/30 hover:border-[#e3577c]/60 hover:shadow-[0_10px_35px_-5px_rgba(227,87,124,0.3)]',
    cyan: 'border-[#38bdf8]/30 hover:border-[#38bdf8]/60 hover:shadow-[0_10px_35px_-5px_rgba(56,189,248,0.3)]',
    emerald: 'border-[#10b981]/30 hover:border-[#10b981]/60 hover:shadow-[0_10px_35px_-5px_rgba(16,185,129,0.3)]',
    amber: 'border-[#f59e0b]/30 hover:border-[#f59e0b]/60 hover:shadow-[0_10px_35px_-5px_rgba(245,158,11,0.3)]',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
          isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
        }`,
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      className={`relative overflow-hidden rounded-2xl bg-[#0b1120]/80 backdrop-blur-xl border transition-all duration-300 transform-style-3d ${
        glowStyles[glowColor]
      } ${className}`}
    >
      {/* Specular Glare Reflection Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-30"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.4), transparent 80%)`,
        }}
      />

      {/* Subtle Inner Glow Border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />

      {/* Content Container with 3D Depth */}
      <div
        className="relative z-10"
        style={{
          transform: isHovered ? `translateZ(${depth}px)` : 'translateZ(0px)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
