'use client';

import { useEffect, useState } from 'react';

interface ShimmerTextProps {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}

export function ShimmerText({
  children,
  duration = 2,
  className = ''
}: ShimmerTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`inline-block bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: '200% auto',
        animation: `shimmer ${duration}s linear infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </span>
  );
}
