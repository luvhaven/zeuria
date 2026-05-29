"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsProvider() {
    const pathname = usePathname();
    const lastPath = useRef<string | null>(null);

    useEffect(() => {
        // Avoid double-firing on strict mode or re-renders
        if (pathname === lastPath.current) return;
        lastPath.current = pathname;
        trackPageView(pathname);
    }, [pathname]);

    return null;
}
