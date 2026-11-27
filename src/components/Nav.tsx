"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { TRON_ADDRESS } from "@/lib/wallet";
import { shortAddr } from "@/lib/tron";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/stake", label: "Stake" },
  { href: "/rewards", label: "Rewards" },
];

export function Nav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-400 text-lg font-black text-white">
          T
        </div>
        <div>
          <div className="text-sm font-bold tracking-wide">TronStake</div>
                  </div>
      </div>

      <nav className="hidden items-center gap-1 rounded-full border border-[var(--line)] bg-[rgba(0,0,0,0.25)] p-1 md:flex">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                active ? "bg-[var(--panel-2)] text-white" : "muted hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <div className="pill font-mono text-xs">
          <span className="h-2 w-2 rounded-full bg-[var(--ok)]" />
          {shortAddr(TRON_ADDRESS, 5)}
        </div>
        {status === "authenticated" ? (
          <button type="button" className="btn btn-ghost px-3 py-2 text-xs" onClick={() => signOut({ callbackUrl: "/" })}>
            {session?.user?.name || "GitHub"} · Logout
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary px-3 py-2 text-xs"
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            GitHub Login
          </button>
        )}
      </div>
    </header>
  );
}
