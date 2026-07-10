"use client";

import React, { lazy, Suspense } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { useWindowSize } from "@/hooks";
import { media } from "@/utils/style";

const DisplacementSphere = lazy(() =>
  import("@/ui/displacement-sphere/index").then((module) => ({
    default: module.DisplacementSphere,
  }))
);

export default function Background() {
  const isHydrated = useHydrated();
  const { width } = useWindowSize();

  return isHydrated && width > media.tablet ? (
    <Suspense>
      <DisplacementSphere />
    </Suspense>
  ) : null;
}
