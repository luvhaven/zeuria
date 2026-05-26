"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function TransitionLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    // Prevent hydration mismatch by delaying the freeze container
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1], // Cinematic ease-out
                }}
                style={{
                    width: "100%",
                }}
            >
                {/* We use FrozenRouter pattern if needed, but simple AnimatePresence keying is often enough for instant flips */}
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
