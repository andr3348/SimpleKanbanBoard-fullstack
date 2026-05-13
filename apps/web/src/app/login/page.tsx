"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/shared/api/http";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent pointer-events-none" />

      <Card className="w-full max-w-md relative shadow-2xl shadow-black/40">
        <CardHeader className="items-center text-center gap-3 pb-0">
          <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <LayoutDashboard className="size-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Kanban Board</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              A simple collaborative task management tool
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                tab === "login"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
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
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Register
            </button>
          </div>

          {tab === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
      </Card>
    </div>
  );
}
