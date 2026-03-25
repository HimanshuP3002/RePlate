"use client";

import { clearSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      className="buttonGhost"
      onClick={() => {
        clearSession();
        router.push("/auth");
      }}
    >
      Logout
    </button>
  );
}
