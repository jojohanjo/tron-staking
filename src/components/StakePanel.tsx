"use client";

import { useMemo, useState } from "react";
import { stakeTrx, unstakeTrx, type StakeResource } from "@/lib/tron";

export function StakePanel({
  availableTrx,
  onDone,
}: {
  availableTrx: number;
  onDone?: () => void;
}) {
  const [mode, setMode] = useState<"stake" | "unstake">("stake");
  const [resource, setResource] = useState<StakeResource>("ENERGY");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string>("");

  const parsed = useMemo(() => Number(amount), [amount]);
  const canSubmit = Number.isFinite(parsed) && parsed > 0 && !busy;

  async function submit() {
    setBusy(true);
    setLog("");
    try {
      const fn = mode === "stake" ? stakeTrx : unstakeTrx;
      const receipt = await fn(parsed, resource);
      setLog(JSON.stringify(receipt, null, 2));
      onDone?.();
    } catch (e) {
      setLog(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{mode === "stake" ? "Stake TRX" : "Unstake TRX"}</h2>
          <p className="muted mt-1 text-sm">Stake 2.0 · Energy / Bandwidth</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`btn ${mode === "stake" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("stake")}
            type="button"
          >
            Stake
          </button>
          <button
            className={`btn ${mode === "unstake" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setMode("unstake")}
            type="button"
          >
            Unstake
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(["ENERGY", "BANDWIDTH"] as StakeResource[]).map((r) => (
          <button
            key={r}
            type="button"
            className={`btn ${resource === r ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setResource(r)}
          >
            {r === "ENERGY" ? "Energy" : "Bandwidth"}
          </button>
        ))}
      </div>

      <label className="muted mb-2 block text-xs font-semibold uppercase tracking-wider">
        Amount (TRX)
      </label>
      <div className="flex gap-2">
        <input
          className="input"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setAmount(String(Math.max(0, Math.floor(availableTrx * 1000) / 1000)))}
        >
          MAX
        </button>
      </div>
      <div className="muted mt-2 text-xs">Available ≈ {availableTrx.toFixed(6)} TRX</div>

      <button className="btn btn-primary mt-5 w-full" disabled={!canSubmit} onClick={submit} type="button">
        {busy ? "Broadcasting…" : mode === "stake" ? "Confirm Stake" : "Confirm Unstake"}
      </button>

      {log ? (
        <pre className="mt-4 max-h-56 overflow-auto rounded-xl border border-[var(--line)] bg-black/40 p-3 text-xs text-red-200">
          {log}
        </pre>
      ) : null}
    </div>
  );
}
