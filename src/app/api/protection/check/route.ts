import { NextRequest, NextResponse } from "next/server";
import {
  demoProtectionScan,
  mapBackendScan,
  type BackendCheckResponse,
  type ProtectionScanRequest,
} from "@/lib/protection-api";

const DEFAULT_BACKEND_URL = "http://localhost:3001";
const DEFAULT_API_KEY = "cardinal_demo_key";
const DEFAULT_FROM_ADDRESS = "0x1230000000000000000000000000000000000456";

export async function POST(request: NextRequest) {
  const input = (await request.json().catch(() => null)) as ProtectionScanRequest | null;
  if (!input) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validationError = validateInput(input);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (scanMode() === "demo") {
    return NextResponse.json(demoProtectionScan(input));
  }

  const backendUrl = requiredServerEnv("CARDINAL_API_URL", DEFAULT_BACKEND_URL);
  const apiKey = requiredServerEnv("CARDINAL_API_KEY", DEFAULT_API_KEY);

  if (!backendUrl || !apiKey) {
    return NextResponse.json(
      {
        error:
          "Cardinal Protection API is not configured. Missing CARDINAL_API_URL or CARDINAL_API_KEY.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/check-transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(toBackendPayload(input)),
      cache: "no-store",
    });

    const body = (await response.json().catch(() => null)) as
      | BackendCheckResponse
      | { message?: string }
      | null;

    if (!response.ok) {
      const message =
        body && "message" in body && body.message ? body.message : "Backend scan failed";
      return NextResponse.json(
        {
          error: message,
          backendStatus: response.status,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(mapBackendScan(body as BackendCheckResponse));
  } catch (error) {
    return NextResponse.json(
      {
        error: `Cardinal Protection API unavailable: ${errorMessage(error)}`,
      },
      { status: 502 },
    );
  }
}

function scanMode() {
  return process.env.CARDINAL_SCAN_MODE === "demo" ? "demo" : "live";
}

function requiredServerEnv(name: string, localDefault: string): string | null {
  const value = process.env[name];
  if (value) {
    return value;
  }
  return process.env.NODE_ENV === "production" ? null : localDefault;
}

function validateInput(input: ProtectionScanRequest): string | null {
  if (!isEvmAddress(input.recipient)) {
    return "Recipient must be a valid EVM address";
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return "Amount must be greater than 0";
  }
  if (!input.token || input.token.length > 32) {
    return "Token is required";
  }
  if (input.fromAddress && !isEvmAddress(input.fromAddress)) {
    return "Sender must be a valid EVM address when provided";
  }
  return null;
}

function toBackendPayload(input: ProtectionScanRequest) {
  return {
    from_address: input.fromAddress || DEFAULT_FROM_ADDRESS,
    to_address: input.recipient,
    chain: normalizeChain(input.chain),
    token: normalizeToken(input.token),
    amount: input.amount,
    transaction_type: input.transactionType ?? "safe_send",
    contract_address: input.contractAddress,
    contract_verified: input.contractVerified ?? true,
    permissions: input.permissions ?? [],
  };
}

function normalizeChain(chain?: string) {
  const normalized = (chain ?? "arbitrum").trim().toLowerCase();
  if (normalized === "ethereum") return "ethereum";
  if (normalized === "polygon") return "polygon";
  if (normalized === "base") return "base";
  if (normalized === "optimism") return "optimism";
  if (normalized === "bnb") return "bnb";
  if (normalized === "solana") return "solana";
  return "arbitrum";
}

function normalizeToken(token: string) {
  const normalized = token.trim().toUpperCase();
  return normalized === "TUSDC" ? "USDC" : normalized;
}

function isEvmAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown backend error";
}
