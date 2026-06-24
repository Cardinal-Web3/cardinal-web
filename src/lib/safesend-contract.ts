import { ethers } from "ethers";

export const ARBITRUM_SEPOLIA = {
  id: 421614,
  hexId: "0x66eee",
  name: "Arbitrum Sepolia",
  rpcUrl:
    process.env.NEXT_PUBLIC_SAFESEND_RPC_URL ??
    "https://sepolia-rollup.arbitrum.io/rpc",
  explorerUrl: "https://sepolia.arbiscan.io",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
} as const;

export const SAFESEND_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS ??
  "0xC2b58B0CB938d35836E5a4E34b79Bd5E8EcD8f78";

export const SAFESEND_DEPLOYMENT_BLOCK = Number(
  process.env.NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK ?? "272068714",
);

export type SafeSendToken = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
};

export const SAFESEND_TOKENS: SafeSendToken[] = [
  {
    symbol: "TUSDC",
    name: "USD Coin (Testnet)",
    address:
      process.env.NEXT_PUBLIC_SAFESEND_USDC_ADDRESS ??
      "0x15EA32f1eF5c28225E3c9FFbd7741785Cff752d0",
    decimals: 6,
  },
];

export const SAFESEND_ABI = [
  "function createSafeSend(address recipient,address token,uint256 amount,uint256 releaseTime) returns (uint256 transferId)",
  "function cancelSafeSend(uint256 transferId)",
  "function releaseSafeSend(uint256 transferId)",
  "function getSafeSend(uint256 transferId) view returns (tuple(address sender,address recipient,address token,uint256 amount,uint256 feeAmount,uint256 releaseTime,uint8 status))",
  "function previewFee(uint256 amount) view returns (uint256)",
  "function _feeBps() view returns (uint256)",
  "function _feeRecipient() view returns (address)",
  "event SafeSendCreated(uint256 indexed transferId,address indexed sender,address indexed recipient,address token,uint256 amount,uint256 feeAmount,uint256 releaseTime)",
  "event SafeSendCancelled(uint256 indexed transferId,address indexed sender)",
  "event SafeSendReleased(uint256 indexed transferId,address indexed recipient,uint256 recipientAmount,uint256 feeAmount)",
] as const;

export const ERC20_ABI = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner,address spender) view returns (uint256)",
  "function approve(address spender,uint256 value) returns (bool)",
] as const;

export type SafeSendChainStatus = "None" | "Pending" | "Cancelled" | "Released";

export type SafeSendFeeQuote = {
  token: SafeSendToken;
  amountRaw: bigint;
  feeRaw: bigint;
  recipientRaw: bigint;
  feeBps: number;
  allowanceRaw: bigint;
  balanceRaw: bigint;
  approvalRequired: boolean;
  releaseTime: number;
  createGasUnits: bigint;
  approvalGasUnits: bigint;
  totalGasUnits: bigint;
  gasPriceWei: bigint;
  bufferedGasWei: bigint;
  estimatedGasEth: string;
  safeSendFeeFormatted: string;
  recipientReceivesFormatted: string;
  amountFormatted: string;
};

export type SafeSendExecutionResult = {
  transferId: string;
  txHash: string;
  approvalTxHash?: string;
};

const STATUS_LABELS: SafeSendChainStatus[] = [
  "None",
  "Pending",
  "Cancelled",
  "Released",
];

export function getSafeSendToken(symbol?: string | null) {
  if (!symbol) return SAFESEND_TOKENS[0];
  return (
    SAFESEND_TOKENS.find(
      (token) => token.symbol.toLowerCase() === symbol.toLowerCase(),
    ) ?? SAFESEND_TOKENS[0]
  );
}

export function parseSafeSendAmount(amount: number | string, token: SafeSendToken) {
  return ethers.parseUnits(String(amount || "0"), token.decimals);
}

export function formatSafeSendAmount(amount: bigint, tokenOrDecimals: SafeSendToken | number) {
  const decimals =
    typeof tokenOrDecimals === "number" ? tokenOrDecimals : tokenOrDecimals.decimals;
  return trimFormattedUnits(ethers.formatUnits(amount, decimals));
}

export function getSafeSendContract(runner: ethers.ContractRunner) {
  return new ethers.Contract(SAFESEND_CONTRACT_ADDRESS, SAFESEND_ABI, runner);
}

export function getErc20Contract(address: string, runner: ethers.ContractRunner) {
  return new ethers.Contract(address, ERC20_ABI, runner);
}

export async function estimateSafeSend({
  provider,
  signer,
  owner,
  recipient,
  tokenSymbol,
  amount,
  delayHours,
}: {
  provider: ethers.BrowserProvider;
  signer: ethers.JsonRpcSigner;
  owner: string;
  recipient: string;
  tokenSymbol?: string | null;
  amount: number;
  delayHours: number;
}): Promise<SafeSendFeeQuote> {
  const token = getSafeSendToken(tokenSymbol);
  const amountRaw = parseSafeSendAmount(amount, token);
  const releaseTime = Math.floor(Date.now() / 1000) + Math.max(1, delayHours) * 3600;
  const contract = getSafeSendContract(signer);
  const erc20 = getErc20Contract(token.address, signer);

  const [feeRaw, feeBpsRaw, allowanceRaw, balanceRaw, feeData] = await Promise.all([
    contract.previewFee(amountRaw) as Promise<bigint>,
    contract._feeBps() as Promise<bigint>,
    erc20.allowance(owner, SAFESEND_CONTRACT_ADDRESS) as Promise<bigint>,
    erc20.balanceOf(owner) as Promise<bigint>,
    provider.getFeeData(),
  ]);

  const approvalRequired = allowanceRaw < amountRaw;
  const approvalGasUnits = approvalRequired
    ? ((await erc20.approve.estimateGas(
        SAFESEND_CONTRACT_ADDRESS,
        amountRaw,
      )) as bigint)
    : 0n;
  let createGasUnits = 180_000n;
  try {
    createGasUnits = (await contract.createSafeSend.estimateGas(
      recipient,
      token.address,
      amountRaw,
      BigInt(releaseTime),
    )) as bigint;
  } catch {
    // If allowance is not set yet, createSafeSend simulation can revert.
    // Keep a conservative estimate so the user can approve first.
  }
  const totalGasUnits = approvalGasUnits + createGasUnits;
  const gasPriceWei =
    feeData.maxFeePerGas ?? feeData.gasPrice ?? ethers.parseUnits("0.05", "gwei");
  const bufferedGasWei = (totalGasUnits * gasPriceWei * 115n) / 100n;
  const recipientRaw = amountRaw - feeRaw;

  return {
    token,
    amountRaw,
    feeRaw,
    recipientRaw,
    feeBps: Number(feeBpsRaw),
    allowanceRaw,
    balanceRaw,
    approvalRequired,
    releaseTime,
    createGasUnits,
    approvalGasUnits,
    totalGasUnits,
    gasPriceWei,
    bufferedGasWei,
    estimatedGasEth: trimFormattedUnits(ethers.formatEther(bufferedGasWei)),
    safeSendFeeFormatted: formatSafeSendAmount(feeRaw, token),
    recipientReceivesFormatted: formatSafeSendAmount(recipientRaw, token),
    amountFormatted: formatSafeSendAmount(amountRaw, token),
  };
}

export async function executeSafeSend({
  signer,
  owner,
  recipient,
  quote,
  onStep,
}: {
  signer: ethers.JsonRpcSigner;
  owner: string;
  recipient: string;
  quote: SafeSendFeeQuote;
  onStep?: (step: string) => void;
}): Promise<SafeSendExecutionResult> {
  const erc20 = getErc20Contract(quote.token.address, signer);
  let approvalTxHash: string | undefined;

  if (quote.allowanceRaw < quote.amountRaw) {
    onStep?.(`Approving ${quote.token.symbol}`);
    const approvalTx = await erc20.approve(
      SAFESEND_CONTRACT_ADDRESS,
      quote.amountRaw,
    );
    approvalTxHash = approvalTx.hash as string;
    onStep?.("Waiting for approval");
    await approvalTx.wait();
  }

  onStep?.("Locking funds with SafeSend");
  const contract = getSafeSendContract(signer);
  const tx = await contract.createSafeSend(
    recipient,
    quote.token.address,
    quote.amountRaw,
    BigInt(quote.releaseTime),
  );
  onStep?.("Waiting for SafeSend confirmation");
  const receipt = await tx.wait();

  return {
    transferId: extractTransferId(receipt),
    txHash: tx.hash as string,
    approvalTxHash,
  };
}

export async function cancelSafeSendOnChain(
  signer: ethers.JsonRpcSigner,
  transferId: string,
) {
  const contract = getSafeSendContract(signer);
  const tx = await contract.cancelSafeSend(BigInt(transferId));
  await tx.wait();
  return tx.hash as string;
}

export async function releaseSafeSendOnChain(
  signer: ethers.JsonRpcSigner,
  transferId: string,
) {
  const contract = getSafeSendContract(signer);
  const tx = await contract.releaseSafeSend(BigInt(transferId));
  await tx.wait();
  return tx.hash as string;
}

export async function readSafeSendStatus(
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider,
  transferId: string,
) {
  const transfer = await getSafeSendContract(provider).getSafeSend(BigInt(transferId));
  const statusIndex = Number(transfer.status ?? transfer[6] ?? 0);
  return STATUS_LABELS[statusIndex] ?? "None";
}

export function explorerTxUrl(hash: string) {
  return `${ARBITRUM_SEPOLIA.explorerUrl}/tx/${hash}`;
}

export function isUserRejected(error: unknown) {
  return getErrorCode(error) === 4001;
}

export function getBlockchainErrorMessage(error: unknown) {
  if (isUserRejected(error)) return "Wallet signature was rejected.";
  if (typeof error === "object" && error && "shortMessage" in error) {
    return String((error as { shortMessage: string }).shortMessage);
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: string }).message);
  }
  return "SafeSend transaction failed. Please try again.";
}

function extractTransferId(receipt: ethers.TransactionReceipt | null) {
  if (!receipt) return "0";
  const iface = new ethers.Interface(SAFESEND_ABI);
  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed?.name === "SafeSendCreated") {
        return parsed.args.transferId.toString();
      }
    } catch {
      // Ignore logs from other contracts in the receipt.
    }
  }
  return "0";
}

function getErrorCode(error: unknown) {
  if (typeof error === "object" && error && "code" in error) {
    return Number((error as { code: number }).code);
  }
  return undefined;
}

function trimFormattedUnits(value: string) {
  if (!value.includes(".")) return value;
  return value.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
}
