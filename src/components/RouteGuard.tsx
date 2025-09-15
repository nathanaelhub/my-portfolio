"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/resources";
import { Flex, Spinner } from "@once-ui-system/core";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const [isRouteEnabled, setIsRouteEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRouteEnabled = () => {
      if (!pathname) return false;

      // Remove basePath from pathname for route matching
      let routePath = pathname;
      if (process.env.NODE_ENV === 'production') {
        const basePath = '/my-portfolio';
        if (pathname.startsWith(basePath)) {
          routePath = pathname.slice(basePath.length) || '/';
        }
      }

      if (routePath in routes) {
        return routes[routePath as keyof typeof routes];
      }

      const dynamicRoutes = ["/blog", "/work"] as const;
      for (const route of dynamicRoutes) {
        if (routePath?.startsWith(route) && routes[route]) {
          return true;
        }
      }

      return false;
    };

    const routeEnabled = checkRouteEnabled();
    setIsRouteEnabled(routeEnabled);
    setLoading(false);
  }, [pathname]);

  if (loading) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (!isRouteEnabled) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
