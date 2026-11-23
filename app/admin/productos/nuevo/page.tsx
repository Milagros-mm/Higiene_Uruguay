"use client";

import React from "react";
import { ProductForm } from "@/frontend/components/admin/ProductForm";

export default function NewProductPage() {
  return <ProductForm isNew={true} />;
}
