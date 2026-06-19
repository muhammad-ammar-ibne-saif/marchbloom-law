"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5"
    >
      <LogOut size={14} />
      Sign out
    </button>
  );
}
