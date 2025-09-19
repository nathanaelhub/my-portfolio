"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/resources";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(true); // Default to true for static export
  
  useEffect(() => {
    // For static export, we want to allow all routes to render
    // This prevents hydration issues on GitHub Pages
    if (typeof window !== 'undefined') {
      const checkRouteEnabled = () => {
        if (!pathname) return true;

        // Normalize pathname by removing basePath
        let routePath = pathname;
        if (pathname.startsWith('/my-portfolio')) {
          routePath = pathname.slice('/my-portfolio'.length) || '/';
        }

        // Check if route exists in routes config
        if (routePath in routes) {
          return routes[routePath as keyof typeof routes];
        }

        // Allow dynamic routes for blog and work
        const dynamicRoutes = ["/blog", "/work"] as const;
        for (const route of dynamicRoutes) {
          if (routePath?.startsWith(route) && routes[route]) {
            return true;
          }
        }

        return true; // Default to allowing routes for static export
      };

      const routeEnabled = checkRouteEnabled();
      setIsRouteEnabled(routeEnabled);
    }
  }, [pathname]);

  // For static export, always render children to avoid blank pages
  return <>{children}</>;
};

export { RouteGuard };