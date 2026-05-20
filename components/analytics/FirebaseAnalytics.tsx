"use client";

import { useEffect } from "react";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirebaseApp } from "@/lib/firebase";

let analyticsInstance: Analytics | null = null;

export default function FirebaseAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    void isSupported().then((supported) => {
      if (!supported || analyticsInstance) return;
      analyticsInstance = getAnalytics(getFirebaseApp());
    });
  }, []);

  return null;
}
