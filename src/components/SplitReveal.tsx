"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface SplitRevealProps {
    text: string;
    tag?: "h1" | "h2" | "h3" | "p" | "span";
    className?: string;
    style?: React.CSSProperties;
    delay?: number;
    stagger?: number;
    once?: boolean;
}

/**
 * SplitReveal – character-by-character text mask reveal.
 * Each character slides up through an `overflow:hidden` clip,
 * producing the premium "curtain pull" effect seen on Awwwards sites.
 */
export default function SplitReveal({
    text,
    tag: Tag = "h2",
    className,
    style,
    delay = 0,
    stagger = 0.03,
    once = true,
}: SplitRevealProps) {
    const ref = useRef(null);
    const inView = useInView(ref, { once, margin: "-60px" });

    const words = text.split(" ");

    return (
        <Tag
            ref={ref}
            className={className}
            style={{ ...style, display: "flex", flexWrap: "wrap", gap: "0 0.3em" }}
            aria-label={text}
        >
            {words.map((word, wi) => (
                <span key={wi} style={{ display: "flex", overflow: "hidden", lineHeight: 1.2, paddingBottom: "0.05em" }}>
                    {word.split("").map((char, ci) => (
                        <motion.span
                            key={ci}
                            aria-hidden
                            initial={{ y: "110%", opacity: 0 }}
                            animate={inView ? { y: "0%", opacity: 1 } : {}}
                            transition={{
                                duration: 0.7,
                                delay: delay + (wi * word.length + ci) * stagger,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            style={{ display: "inline-block" }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </Tag>
    );
}
