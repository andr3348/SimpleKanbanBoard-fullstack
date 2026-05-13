"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/shared/api/http";

interface Props {
  children: ReactNode;
}

export default function BoardsLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        await http.get("/auth/me");
        // User is authenticated, allow access
      } catch {
        // Not authenticated, redirect to login
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return <>{children}</>;
}
