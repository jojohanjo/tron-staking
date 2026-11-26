"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  return (
    <div className="mx-auto mt-10 max-w-md">
      <div className="card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#24292f] text-2xl">
          ⌘
        </div>
        <h1 className="text-2xl font-bold">GitHub로 로그인</h1>
        <p className="muted mt-2 text-sm leading-6">
          TronStake 데모 계정 연동. OAuth App의 Client ID/Secret을 `.env.local`에 넣으면
          바로 동작합니다.
        </p>

        <button
          type="button"
          className="btn btn-primary mt-6 w-full"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          disabled={status === "loading"}
        >
          Continue with GitHub
        </button>

        <a
          className="btn btn-ghost mt-3 w-full"
          href="https://github.com/settings/applications/new"
          target="_blank"
          rel="noreferrer"
        >
          GitHub OAuth App 만들기
        </a>

        {session?.user ? (
          <p className="mt-4 text-sm text-[var(--ok)]">이미 로그인됨: {session.user.name || session.user.email}</p>
        ) : null}
      </div>

      <div className="card mt-4 p-4 text-left text-xs leading-5">
        <div className="font-semibold">OAuth App 설정값</div>
        <ul className="muted mt-2 space-y-1">
          <li>Homepage URL: `http://localhost:3000`</li>
          <li>Authorization callback URL: `http://localhost:3000/api/auth/callback/github`</li>
          <li>발급받은 값을 `.env.local`의 `GITHUB_ID` / `GITHUB_SECRET`에 넣기</li>
        </ul>
      </div>
    </div>
  );
}
