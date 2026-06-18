import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const v: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Reveal({
  children,
  i = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const Comp = motion[As] as typeof motion.div;
  return (
    <Comp
      className={className}
      variants={v}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </Comp>
  );
}
