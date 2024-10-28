"use client";

import React, { lazy, Suspense } from "react";
import { useHydrated } from "@/hooks/useHydrated";

const DisplacementSphere = lazy(() =>
  import("@/ui/displacement-sphere/index").then((module) => ({
    default: module.DisplacementSphere,
  }))
);

export default function Background() {
  const isHydrated = useHydrated();
  return isHydrated ? (
    <Suspense>
      <DisplacementSphere />
    </Suspense>
  ) : null;
}
