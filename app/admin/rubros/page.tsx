"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectRubrosPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/productos?tab=rubros");
  }, [router]);
  return null;
}
