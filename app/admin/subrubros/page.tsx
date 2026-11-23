"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectSubrubrosPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/productos?tab=rubros");
  }, [router]);
  return null;
}
