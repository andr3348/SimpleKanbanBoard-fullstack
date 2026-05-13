"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { http } from "@/shared/api/http";

export default function LoginPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        await http.get("/auth/me");
        // If successful, user is already authenticated - redirect to boards
        router.push("/boards");
      } catch {
        // Not authenticated, show login page
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleTestLogin = async () => {
    try {
      const response = await http.get("/auth/test-login");
      console.log("Test login successful:", response.data);
      // Redirect to boards page
      router.push("/boards");
    } catch (error) {
      console.error("Test login failed:", error);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <p className="text-white">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2">Kanban Board</h1>
        <p className="text-center text-gray-600 mb-8">
          A simple collaborative task management tool
        </p>

        <div className="space-y-4">
          <Button onClick={handleTestLogin} className="w-full" size="lg">
            Test Login (Development)
          </Button>

          <p className="text-xs text-center text-gray-500 mt-6">
            ⚠️ This is a development-only login. Remove this page before
            production.
          </p>
        </div>
      </div>
    </div>
  );
}
