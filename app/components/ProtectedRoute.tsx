"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Agar token nahi hai, toh login page par redirect karo
      router.replace("/");
    } else {
      // Agar token hai, toh content dikhao
      setIsAuthorized(true);
    }
  }, [router]);

  // Jab tak check ho raha hai, tab tak empty ya loading dikhao
  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}