export const SAMPLE_ADDRESSES = [
  "0x7c8b3F2a91Ee46aD9B4D2c1A8e7F6c3b5D9E2a14",
  "0xA1b2C3d4E5f6789012345678901234567890aBcD",
  "0xDe4dB33fCa11FedB1cba1eDe4f0c0ffeefc0ffee",
  "0xCa11Ab1eC0deBabe0123F1eece4c0Affab1eDeAd",
];

export type Verdict = "ALLOW" | "REVIEW" | "BLOCK";

export type SignalKey =
  | "wallet_reputation"
  | "recipient_history"
  | "network_validation"
  | "contract_analysis"
  | "simulation";

export const SIGNAL_LABELS: Record<SignalKey, string> = {
  wallet_reputation: "Wallet reputation",
  recipient_history: "Recipient history",
  network_validation: "Network validation",
  contract_analysis: "Contract analysis",
  simulation: "Transaction simulation",
};

export type Finding = {
  signal: SignalKey;
  severity: "info" | "low" | "med" | "high";
  text: string;
};

export type ScanResult = {
  verdict: Verdict;
  score: number;
  findings: Finding[];
};

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function scanTransaction(input: {
  recipient: string;
  amount: number;
  token: string;
}): ScanResult {
  const h = hash(input.recipient + input.amount + input.token);
  const bucket = h % 100;
  let verdict: Verdict = "ALLOW";
  if (bucket > 88) verdict = "BLOCK";
  else if (bucket > 62) verdict = "REVIEW";

  const findings: Finding[] = [];
  if (verdict === "BLOCK") {
    findings.push({
      signal: "wallet_reputation",
      severity: "high",
      text: "Recipient associated with 3 reported drainer campaigns.",
    });
    findings.push({
      signal: "contract_analysis",
      severity: "high",
      text: "Calldata sets unlimited token approval to unknown spender.",
    });
    findings.push({
      signal: "recipient_history",
      severity: "med",
      text: "No prior interactions from your wallet with this address.",
    });
  } else if (verdict === "REVIEW") {
    findings.push({
      signal: "recipient_history",
      severity: "med",
      text: "First-time recipient. No transaction history.",
    });
    findings.push({
      signal: "simulation",
      severity: "low",
      text: "Gas estimate 23% above network median.",
    });
  } else {
    findings.push({
      signal: "recipient_history",
      severity: "info",
      text: "Recipient seen in 14 prior settlements without incident.",
    });
    findings.push({
      signal: "simulation",
      severity: "info",
      text: "Simulation completed. Net balance delta matches intent.",
    });
  }

  const score =
    verdict === "ALLOW" ? 88 + (bucket % 10) : verdict === "REVIEW" ? 48 + (bucket % 18) : 12 + (bucket % 22);
  return { verdict, score, findings };
}

export function shortAddr(addr: string, n = 4) {
  if (!addr) return "";
  return `${addr.slice(0, 2 + n)}…${addr.slice(-n)}`;
}
