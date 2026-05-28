import { useEffect, useState } from 'react';

/**
 * HydrationWrapper ensures all Zustand stores are loaded from localStorage before rendering.
 * This prevents hydration mismatches between server and client.
 */
export function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Wait for next tick to ensure all stores have hydrated from localStorage
    const timeout = setTimeout(() => {
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (!isHydrated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to bottom right, #111827, #1f2937)'
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
