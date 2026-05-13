"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/shared/api/http";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { LayoutDashboard } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [tab, setTab] = useState<"login" | "register">("login");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await http.get("/auth/me");
        router.push("/boards");
      } catch {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-zinc-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <div className="flex w-full max-w-4xl min-h-[560px] rounded-2xl bg-white shadow-xl shadow-black/5 overflow-hidden">
        {/* Brand side */}
        <div className="hidden md:flex w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.3),transparent_50%)]" />
          <div className="absolute top-0 -right-20 size-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 size-40 rounded-full bg-white/5 blur-2xl" />
          <div className="relative flex flex-col justify-between p-10 w-full">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <LayoutDashboard className="size-5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Kanban Board
              </span>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">
                Manage your projects
              </h2>
              <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                Organize tasks, collaborate with your team, and ship faster with
                the simple Kanban workflow.
              </p>
            </div>
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="size-8 rounded-full bg-white/20 ring-2 ring-indigo-700"
                />
              ))}
              <div className="size-8 rounded-full bg-white/10 ring-2 ring-indigo-700 flex items-center justify-center">
                <span className="text-[10px] font-medium text-white/80">
                  +3
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-12">
          <div className="md:hidden flex items-center gap-3 mb-8">
            <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <LayoutDashboard className="size-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Kanban Board
            </span>
          </div>

          <div className="flex bg-zinc-100 rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                tab === "login"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900",
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                tab === "register"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900",
              )}
            >
              Register
            </button>
          </div>

          {tab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
