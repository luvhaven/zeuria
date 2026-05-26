"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
    const pathname = usePathname();
    const [isHovering, setIsHovering] = useState(false);
    const [isMagnet, setIsMagnet] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(cursorX, springConfig);
    const smoothY = useSpring(cursorY, springConfig);

    const [isTouchDevice, setIsTouchDevice] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
        }
    }, []);

    useEffect(() => {
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            if (!isMagnet) {
                cursorX.set(e.clientX - 10);
                cursorY.set(e.clientY - 10);
            }
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseout", handleMouseLeave);
        window.addEventListener("mouseover", handleMouseEnter);

        const updateHoverStates = () => {
            const linksAndButtons = document.querySelectorAll("a, button, input-[type=submit], .card-hover");

            linksAndButtons.forEach((el) => {
                el.addEventListener("mouseenter", () => setIsHovering(true));
                el.addEventListener("mouseleave", () => setIsHovering(false));
            });

            // Special magnetic logic (requires data-cursor-magnet prop)
            const magnets = document.querySelectorAll("[data-cursor-magnet]");
            magnets.forEach((el) => {
                el.addEventListener("mousemove", (e) => {
                    const ev = e as MouseEvent;
                    const rect = el.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    // Pull target towards center
                    setIsMagnet(true);
                    cursorX.set(centerX - 10 + (ev.clientX - centerX) * 0.2);
                    cursorY.set(centerY - 10 + (ev.clientY - centerY) * 0.2);
                });
                el.addEventListener("mouseleave", () => {
                    setIsMagnet(false);
                });
            });
        };

        updateHoverStates();
        // Use timeout to ensure DOM is ready after navigation
        const timeout = setTimeout(updateHoverStates, 500);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseout", handleMouseLeave);
            window.removeEventListener("mouseover", handleMouseEnter);
            clearTimeout(timeout);
        };
    }, [cursorX, cursorY, isMagnet, isVisible, isTouchDevice, pathname]);

    if (isTouchDevice) return null;

    return (
        <>
            <motion.div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: 20,
                    height: 20,
                    backgroundColor: isHovering ? "rgba(200, 120, 42, 0.2)" : "#fff",
                    mixBlendMode: "difference",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    x: smoothX,
                    y: smoothY,
                    scale: isHovering ? 2 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
            />
            <style>{`
        @media (pointer: fine) {
          body, a, button {
            cursor: none !important;
          }
        }
      `}</style>
        </>
    );
}
