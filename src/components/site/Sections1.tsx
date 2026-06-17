import { motion } from "motion/react";

function Section({
  eyebrow,
  title,
  lede,
  children,
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="relative px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="eyebrow mb-4">{eyebrow}</div>
          <h2 className="font-display text-balance text-[clamp(34px,5vw,60px)] leading-[1] tracking-[-0.03em]">
            {title}
          </h2>
          {lede && (
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
              {lede}
            </p>
          )}
        </motion.div>
        {children && <div className="mt-14">{children}</div>}
      </div>
    </section>
  );
}

export function Problem() {
  const risks = [
    { code: "approve(0xDe4d…,∞)", text: "Malicious unlimited approval drains tokens" },
    { code: "to: 0xCa11…", text: "Lookalike address swap by clipboard hijack" },
    { code: "network: arbitrum", text: "Bridged to the wrong network — funds lost" },
    { code: "permit(deadline: 2099)", text: "Off-chain signature replayed forever" },
    { code: "revoke ✗", text: "Once signed, on-chain settlement is irreversible" },
  ];

  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title={
        <>
          One signature is the difference
          <br />
          between settlement and total loss.
        </>
      }
      lede="Wallets are the last line of defense — and they were never designed for it. Cardinal sits between intent and execution, so dangerous transactions never reach the chain."
    >
      <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              wallet · unprotected
            </div>
            <div className="font-mono text-[11px] text-red">verdict: ∅</div>
          </div>
          <div className="space-y-2.5 p-5">
            {risks.map((r, i) => (
              <motion.div
                key={r.code}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[oklch(0.17_0.011_250)] px-3 py-2.5"
              >
                <span className="mt-1.5 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-red shadow-[0_0_10px_oklch(0.67_0.22_25)]" />
                <div className="min-w-0">
                  <div className="font-mono text-[12px] text-red/90">{r.code}</div>
                  <div className="mt-0.5 text-[13px] text-foreground/85">{r.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="surface-card relative overflow-hidden p-6">
          <div className="font-display text-[22px] leading-snug">
            $3.7B+ lost to preventable transaction errors and contract approvals
            in the last 24 months.
          </div>
          <div className="mt-6 space-y-3 text-[13.5px] text-muted-foreground">
            <p>
              Most users find out only after the block is final. There is no
              undo on-chain, no fraud reversal, no merchant chargeback.
            </p>
            <p>
              Cardinal moves the decision earlier — to the moment intent forms,
              before a signature creates a settlement.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)]">
            {[
              ["$1.9B", "Drainer losses"],
              ["$820M", "Wrong network"],
              ["$960M", "Address spoof"],
            ].map(([v, l]) => (
              <div key={l} className="bg-surface px-4 py-4">
                <div className="font-display text-xl text-foreground">{v}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function HowItWorks() {
  const steps = [
    ["01", "Connect", "Wallet binds to a Cardinal session — no custody, no keys."],
    ["02", "Compose", "User assembles the transaction in any dApp or Cardinal app."],
    ["03", "Scan", "Five signal classes evaluated in under 50ms."],
    ["04", "Verdict", "Allow, Review, or Block with human-readable findings."],
    ["05", "SafeSend", "High-risk moves rerouted into a delayed, cancellable transfer."],
    ["06", "Settle", "Funds release on-chain only after the protection window closes."],
  ];

  return (
    <Section
      id="how"
      eyebrow="How Cardinal works"
      title={
        <>
          A six-stage protection
          <br />
          pipeline for every transaction.
        </>
      }
      lede="Cardinal slots between wallet and chain. Every step is observable, explainable, and cancellable."
    >
      <div className="grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
        {steps.map(([n, t, d], i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative bg-surface p-7"
          >
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-cyan/80">
                {n}
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-cyan/60 to-transparent" />
            </div>
            <div className="font-display mt-5 text-[22px] tracking-tight">{t}</div>
            <div className="mt-2 text-[13.5px] text-muted-foreground">{d}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
