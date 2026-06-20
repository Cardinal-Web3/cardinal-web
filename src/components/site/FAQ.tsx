import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const QS = [
  {
    q: "Is Cardinal a wallet?",
    a: "No. Cardinal is the trust layer between wallets, exchanges, and chains. We scan risk before signature, explain findings in plain English, and route users into safer settlement flows — we never hold custody.",
  },
  {
    q: "How does SafeSend work?",
    a: "SafeSend protects direct transfers by scanning risk before signing. After a low-risk verdict, funds lock in a programmable delay you choose — giving you a second chance to cancel before settlement.",
  },
  {
    q: "What's the difference between SafeSend and escrow?",
    a: "SafeSend protects direct transfers with a cancellable delay after scan and signature. Escrow holds funds until both buyer and seller meet agreed terms — ideal for marketplaces. Escrow is on the roadmap; SafeSend is in controlled pilot.",
  },
  {
    q: "What chains do you support?",
    a: "Pilot supports Ethereum, Base, and Arbitrum. Solana and additional EVM chains are next in our roadmap.",
  },
  {
    q: "Do you store private keys?",
    a: "Never. Cardinal is non-custodial. Signatures stay in your wallet; we only see public transaction data the Protection Engine needs.",
  },
  {
    q: "When does Cardinal open to the public?",
    a: "We're running a controlled pilot. Request access from /pilot — we onboard partners weekly.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl">
        <div className="eyebrow mb-4">FAQ</div>
        <h2 className="font-display text-balance text-[clamp(32px,4.5vw,52px)] leading-[1] tracking-[-0.03em]">
          Questions, answered without
          <br />
          marketing fog.
        </h2>
        <div className="mt-12 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {QS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition hover:text-cyan"
                >
                  <span className="font-display text-[18px] tracking-tight">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="font-mono shrink-0 text-cyan"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-5 text-[15px] leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
