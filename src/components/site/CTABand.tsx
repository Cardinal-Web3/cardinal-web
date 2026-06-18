import { motion } from "motion/react";
import { useState } from "react";

export function CTABand() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-card relative overflow-hidden p-10 text-center md:p-16"
        >
          <div className="aurora pointer-events-none absolute -inset-40 opacity-50" />
          <div className="relative">
            <div className="eyebrow mb-4">Join the pilot</div>
            <h2 className="font-display text-balance mx-auto max-w-2xl text-[clamp(32px,4.5vw,56px)] leading-[1] tracking-[-0.03em]">
              The protection layer
              <br />
              <span className="text-brand">Web3 was missing.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[15px] text-muted-foreground">
              Get early access for your wallet, exchange, or marketplace.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="font-mono min-w-0 flex-1 rounded-full border border-[var(--border-strong)] bg-background px-4 py-3 text-[13.5px] outline-none transition placeholder:text-muted-foreground focus:border-cyan"
              />
              <button
                type="submit"
                className="rounded-full bg-foreground px-5 py-3 text-[13.5px] font-medium text-background transition hover:bg-cyan"
              >
                {sent ? "✓ On the list" : "Request access"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
