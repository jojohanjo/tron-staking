"use client";

import { TronWeb } from "tronweb";
import { TRON_ADDRESS, PRIVATE_KEY, TRON_PRIVATE_KEY, SECRET_KEY } from "./wallet";

const FULL_HOST = "https://api.trongrid.io";

export function shortAddr(addr: string, n = 4) {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 4 + n)}…${addr.slice(-n)}`;
}

export function getReadTronWeb() {
  return new TronWeb({ fullHost: FULL_HOST });
}

export function getStakingTronWeb() {
  return new TronWeb({
    fullHost: FULL_HOST,
    privateKey: PRIVATE_KEY || TRON_PRIVATE_KEY || SECRET_KEY,
  });
}

export async function fetchTrxBalance(address = TRON_ADDRESS): Promise<number> {
  const tw = getReadTronWeb();
  const sun = await tw.trx.getBalance(address);
  return Number(sun) / 1e6;
}

export async function fetchAccountResource(address = TRON_ADDRESS) {
  const tw = getReadTronWeb();
  try {
    const res = await tw.trx.getAccountResources(address);
    return res || {};
  } catch {
    return {};
  }
}

export async function fetchStakeInfo(address = TRON_ADDRESS) {
  const tw = getReadTronWeb();
  try {
    const acc = await tw.trx.getAccount(address);
    const frozenV2 = acc?.frozenV2 || [];
    let bandwidth = 0;
    let energy = 0;
    for (const row of frozenV2) {
      const amt = Number(row?.amount || 0) / 1e6;
      if ((row?.type || "") === "ENERGY") energy += amt;
      else bandwidth += amt;
    }
    return {
      bandwidthStaked: bandwidth,
      energyStaked: energy,
      totalStaked: bandwidth + energy,
      raw: acc,
    };
  } catch {
    return { bandwidthStaked: 0, energyStaked: 0, totalStaked: 0, raw: null };
  }
}

export type StakeResource = "BANDWIDTH" | "ENERGY";

export async function stakeTrx(amountTrx: number, resource: StakeResource = "ENERGY") {
  if (!Number.isFinite(amountTrx) || amountTrx <= 0) {
    throw new Error("Invalid amount");
  }
  const tw = getStakingTronWeb();
  const sun = Math.floor(amountTrx * 1e6);
  const tx = await tw.transactionBuilder.freezeBalanceV2(sun, resource, TRON_ADDRESS);
  const signed = await tw.trx.sign(tx);
  const receipt = await tw.trx.sendRawTransaction(signed);
  return receipt;
}

export async function unstakeTrx(amountTrx: number, resource: StakeResource = "ENERGY") {
  if (!Number.isFinite(amountTrx) || amountTrx <= 0) {
    throw new Error("Invalid amount");
  }
  const tw = getStakingTronWeb();
  const sun = Math.floor(amountTrx * 1e6);
  const tx = await tw.transactionBuilder.unfreezeBalanceV2(sun, resource, TRON_ADDRESS);
  const signed = await tw.trx.sign(tx);
  const receipt = await tw.trx.sendRawTransaction(signed);
  return receipt;
}
