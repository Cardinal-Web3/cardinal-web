# SafeSend Contract Integration

This MVP wires the SafeSend UI to Muhammad's Arbitrum Sepolia SafeSend contract after the
Cardinal backend risk scan.

## Flow

```text
Compose SafeSend
-> Cardinal backend scan
-> ALLOW / REVIEW verdict
-> estimate SafeSend fee + gas
-> approve TUSDC if allowance is missing
-> createSafeSend on the contract
-> receipt + dashboard
```

`BLOCK` verdicts do not continue to contract signing.

## Contract Config

Defaults are stored in `src/lib/safesend-contract.ts` and can be overridden with env vars.

```env
NEXT_PUBLIC_SAFESEND_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_SAFESEND_CONTRACT_ADDRESS=0xC2b58B0CB938d35836E5a4E34b79Bd5E8EcD8f78
NEXT_PUBLIC_SAFESEND_USDC_ADDRESS=0x15EA32f1eF5c28225E3c9FFbd7741785Cff752d0
NEXT_PUBLIC_SAFESEND_DEPLOYMENT_BLOCK=272068714
```

## Current MVP Scope

- MetaMask is the active wallet for the pilot.
- Network target is Arbitrum Sepolia.
- Token target is TUSDC.
- SafeSend fee is read from the contract through `previewFee`.
- Network gas is estimated in the browser and buffered by 15%.
- Dashboard supports on-chain cancel and release when a transfer has a contract `transferId`.

## Contract Behavior

The user approves and locks the full entered token amount. The SafeSend service fee is deducted
from that amount when the transfer is released.

Example:

```text
Amount locked: 100 TUSDC
SafeSend fee: 1 TUSDC
Recipient receives: 99 TUSDC
```

## Production Notes

- Confirm final proxy address, token address, fee recipient, and ABI before mainnet use.
- The current contract has `pause()` and `unpause()`, but `createSafeSend`, `cancelSafeSend`, and
  `releaseSafeSend` do not use `whenNotPaused`. Confirm this behavior before production.
- Add backend transaction reporting later so API customers can reconcile estimated gas, actual gas,
  service fee, and final transfer status.
