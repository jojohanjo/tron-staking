"use client";

import { useCallback, useEffect, useState } from "react";
import { StakePanel } from "@/components/StakePanel";
import { StatCard } from "@/components/StatCard";
import { fetchStakeInfo, fetchTrxBalance } from "@/lib/tron";

export default function StakePage() {
  const [bal, setBal] = useState(0);
  const [staked, setStaked] = useState({ bandwidthStaked: 0, energyStaked: 0, totalStaked: 0 });

  const refresh = useCallback(async () => {
    const [b, s] = await Promise.all([fetchTrxBalance(), fetchStakeInfo()]);
    setBal(b);
    setStaked(s);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <StakePanel availableTrx={bal} onDone={refresh} />
      <div className="space-y-4">
        <StatCard label="Wallet TRX" value={`${bal.toFixed(6)}`} hint="Liquid balance" />
        <StatCard label="Energy staked" value={`${staked.energyStaked.toFixed(6)} TRX`} />
        <StatCard label="Bandwidth staked" value={`${staked.bandwidthStaked.toFixed(6)} TRX`} />
<ul className="muted mt-2 list-disc space-y-1 pl-5">
            <li>Signs with hardcoded staking wallet key only.</li>
            <li>Owner/gas private key is never loaded.</li>
            <li>If owner permission moved, stake txs will fail on-chain.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
