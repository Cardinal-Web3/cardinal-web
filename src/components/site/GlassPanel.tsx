import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";

export function GlassPanel({
  children,
  className = "",
  tilt = "auto",
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  tilt?: "auto" | "left" | "right" | "none";
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const rX = useTransform(sy, [-0.5, 0.5], [intensity * 0.6, -intensity * 0.6]);

  const baseTilt =
    tilt === "left"
      ? "rotateY(6deg) rotateX(3deg)"
      : tilt === "right"
      ? "rotateY(-6deg) rotateX(3deg)"
      : "rotateY(0deg) rotateX(0deg)";

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (tilt === "none") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div style={{ perspective: 1800 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: tilt === "none" ? 0 : rX,
          rotateY: tilt === "none" ? 0 : rY,
          transformStyle: "preserve-3d",
          transform: tilt !== "auto" && tilt !== "none" ? baseTilt : undefined,
        }}
        className="glass-panel relative"
      >
        {children}
      </motion.div>
    </div>
  );
}
