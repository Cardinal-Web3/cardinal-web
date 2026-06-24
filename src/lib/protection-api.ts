import {
  scanTransaction,
  type Finding,
  type ScanResult,
  type SignalKey,
  type Verdict,
} from "./mock-scan";

export type ScanMode = "demo" | "live";

export type ProtectionScanRequest = {
  fromAddress?: string | null;
  recipient: string;
  chain?: string;
  token: string;
  amount: number;
  transactionType?: string;
  contractAddress?: string;
  contractVerified?: boolean;
  permissions?: string[];
};

export type BackendFinding = {
  code: string;
  source: "network" | "scam" | "simulation" | "risk";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  message: string;
  recommended_action?: Verdict;
};

export type BackendCheckResponse = {
  request_id: string;
  risk_score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  network_valid: boolean;
  warnings: string[];
  findings: BackendFinding[];
  recommended_action: Verdict;
  checked_at: string;
};

export type ProtectionScanResult = ScanResult & {
  mode: ScanMode;
  requestId?: string;
  checkedAt?: string;
  riskLevel?: BackendCheckResponse["risk_level"];
  networkValid?: boolean;
  warnings?: string[];
};

export class ProtectionApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ProtectionApiError";
  }
}

export async function requestProtectionScan(
  input: ProtectionScanRequest,
): Promise<ProtectionScanResult> {
  const response = await fetch("/api/protection/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ProtectionApiError(
      body?.error ?? "Cardinal Protection API unavailable",
      response.status,
    );
  }

  return body as ProtectionScanResult;
}

export function demoProtectionScan(input: ProtectionScanRequest): ProtectionScanResult {
  return {
    ...scanTransaction({
      recipient: input.recipient,
      amount: input.amount,
      token: input.token,
    }),
    mode: "demo",
  };
}

export function mapBackendScan(response: BackendCheckResponse): ProtectionScanResult {
  return {
    verdict: response.recommended_action,
    score: response.risk_score,
    findings: response.findings.map(mapFinding),
    mode: "live",
    requestId: response.request_id,
    checkedAt: response.checked_at,
    riskLevel: response.risk_level,
    networkValid: response.network_valid,
    warnings: response.warnings,
  };
}

function mapFinding(finding: BackendFinding): Finding {
  return {
    signal: signalForSource(finding.source),
    severity: severityForBackend(finding.severity),
    text: finding.message,
  };
}

function signalForSource(source: BackendFinding["source"]): SignalKey {
  switch (source) {
    case "network":
      return "network_validation";
    case "scam":
      return "wallet_reputation";
    case "simulation":
      return "simulation";
    case "risk":
    default:
      return "recipient_history";
  }
}

function severityForBackend(severity: BackendFinding["severity"]): Finding["severity"] {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return "high";
    case "MEDIUM":
      return "med";
    case "LOW":
    default:
      return "low";
  }
}
