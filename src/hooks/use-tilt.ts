import { useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import { useCallback } from "react";

export function useTilt(strength = 10) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 150, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 18, mass: 0.4 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-strength, strength]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [strength, -strength]);

  const onMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width - 0.5);
      y.set((e.clientY - r.top) / r.height - 0.5);
    },
    [x, y],
  );
  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { rotateX, rotateY, onMove, onLeave };
}
