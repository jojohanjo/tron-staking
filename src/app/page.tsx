"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { TRON_ADDRESS, OWNER_ADDRESS } from "@/lib/wallet";
import { fetchStakeInfo, fetchTrxBalance, shortAddr } from "@/lib/tron";

export default function HomePage() {
  const [bal, setBal] = useState<number | null>(null);
  const [staked, setStaked] = useState({ bandwidthStaked: 0, energyStaked: 0, totalStaked: 0 });
  const [err, setErr] = useState("");

  const refresh = useCallback(async () => {
    try {
      setErr("");
      const [b, s] = await Promise.all([fetchTrxBalance(), fetchStakeInfo()]);
      setBal(b);
      setStaked(s);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 20000);
    return () => clearInterval(t);
  }, [refresh]);

  const apr = 4.2;
  const estDaily =
    staked.totalStaked > 0 ? ((staked.totalStaked * apr) / 100 / 365).toFixed(4) : "0.0000";

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="pill mb-3 w-fit text-xs">Mainnet · Stake 2.0</div>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">
              Stake TRX.
              <span className="bg-gradient-to-r from-red-400 to-orange-300 bg-clip-text text-transparent">
                {" "}
                Earn voting power.
              </span>
            </h1>
            <p className="muted mt-3 max-w-xl text-sm leading-6">
              Rough demo dashboard for Tron staking. Connected wallet is the demo staking
              address only. Owner/gas private key is never embedded.
            </p>
          </div>
          <Link href="/stake" className="btn btn-primary px-6">
            Go Stake →
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Available TRX" value={bal == null ? "…" : bal.toFixed(3)} hint={shortAddr(TRON_ADDRESS, 6)} />
        <StatCard label="Total Staked" value={`${staked.totalStaked.toFixed(3)} TRX`} hint={`APR ~${apr}% (demo)`} />
        <StatCard label="Energy Stake" value={`${staked.energyStaked.toFixed(3)} TRX`} />
        <StatCard label="Est. Daily" value={`${estDaily} TRX`} hint="Rough estimate only" />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <div className="muted text-xs font-semibold uppercase tracking-wider">Staking wallet</div>
          <div className="mt-2 break-all font-mono text-sm">{TRON_ADDRESS}</div>
          <div className="muted mt-3 text-xs">Private key hardcoded as PRIVATE_KEY / TRON_PRIVATE_KEY (demo wallet only).</div>
        </div>
        <div className="card p-5">
          <div className="muted text-xs font-semibold uppercase tracking-wider">Owner address (display)</div>
          <div className="mt-2 break-all font-mono text-sm">{OWNER_ADDRESS}</div>
          <div className="muted mt-3 text-xs">Address only. Owner private key is NOT stored in this project.</div>
        </div>
      </section>

      {err ? (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">{err}</div>
      ) : null}
    </div>
  );
}
