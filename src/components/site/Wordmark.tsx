import { motion } from "motion/react";

export function Wordmark() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="hairline mx-auto max-w-[1400px]" />
      <div className="mx-auto flex max-w-[1400px] items-end justify-between px-6 pt-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          cardinal // protect.before.signing
        </div>
        <div className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground md:block">
          v0.4 · pilot · 2026
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative px-2 pt-10"
      >
        <div className="wordmark-giant select-none text-center text-lime [text-shadow:0_0_80px_oklch(0.92_0.18_115/0.25)]">
          CARDINAL
        </div>
      </motion.div>
    </section>
  );
}
