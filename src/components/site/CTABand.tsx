import { motion } from "motion/react";
import { useState } from "react";

export function CTABand() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[340px] w-full max-w-[600px] rounded-full bg-cyan/[0.04] blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            className="eyebrow mb-5"
            initial={{ opacity: 0, letterSpacing: "0.3em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.18em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Join the pilot
          </motion.div>

          <h2 className="font-display text-balance text-[clamp(30px,4.5vw,52px)] leading-[1.05] tracking-[-0.03em]">
            Start protecting
            <br />
            <span className="text-brand">before value moves.</span>
          </h2>

          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-10 flex w-full max-w-sm flex-col gap-2.5 sm:flex-row sm:gap-0"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="font-mono min-w-0 flex-1 rounded-full border border-[var(--border)] bg-surface/60 px-5 py-3 text-[13px] outline-none backdrop-blur-sm transition placeholder:text-muted-foreground/60 focus:border-cyan/60 sm:rounded-r-none sm:border-r-0"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full bg-foreground px-6 py-3 text-[13px] font-medium text-background transition-colors hover:bg-cyan sm:rounded-l-none"
            >
              {sent ? "✓ On the list" : "Request access"}
            </motion.button>
          </motion.form>

          <motion.p
            className="mx-auto mt-4 text-[12px] text-muted-foreground/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Wallets, exchanges, and marketplaces welcome.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
