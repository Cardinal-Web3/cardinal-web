import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

/**
 * Plays a brief exit fade before navigating internally.
 * Honors reduced-motion automatically (CSS handles it).
 */
export function useSmoothNav() {
  const navigate = useNavigate();
  return useCallback(
    (to: string) => {
      const root = document.getElementById("page-root");
      if (!root) {
        navigate({ to });
        return;
      }
      root.style.transition = "opacity 220ms ease, transform 220ms ease";
      root.style.opacity = "0";
      root.style.transform = "translateY(-6px)";
      window.setTimeout(() => {
        navigate({ to });
        requestAnimationFrame(() => {
          root.style.opacity = "1";
          root.style.transform = "translateY(0)";
        });
      }, 220);
    },
    [navigate],
  );
}
