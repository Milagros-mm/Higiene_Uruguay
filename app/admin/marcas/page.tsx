"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectMarcasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/productos?tab=marcas");
  }, [router]);
  return null;
}
