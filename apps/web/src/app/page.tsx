"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/shared/api/http";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        await http.get("/auth/me");
        // If successful, user is authenticated - redirect to boards
        router.push("/boards");
      } catch (error) {
        // If 401 or error, user is not authenticated - redirect to login
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  // Show nothing while redirecting
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Redirecting... */}
    </div>
  );
}
