"use client";

import { StatCard } from "@/components/StatCard";

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <p className="muted mt-2 text-sm">
          Placeholder rewards board. Voting rewards / SR share can be wired later.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Claimable" value="0.000 TRX" hint="Demo placeholder" />
        <StatCard label="Lifetime" value="0.000 TRX" hint="Demo placeholder" />
        <StatCard label="Last claim" value="—" hint="No claims yet" />
      </div>
      <button className="btn btn-primary" type="button" disabled>
        Claim Rewards
      </button>
    </div>
  );
}
