"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "auto-images-enabled";

export function useAutoImages() {
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw !== null) {
        setEnabled(raw === "true");
      }
    } catch {
      // Ignore localStorage errors in restricted environments.
    } finally {
      setHydrated(true);
    }
  }, []);

  const setAutoImages = (value: boolean) => {
    setEnabled(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Ignore localStorage errors in restricted environments.
    }
  };

  return { enabled, hydrated, setAutoImages };
}
