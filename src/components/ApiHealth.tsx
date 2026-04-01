"use client";

import { useState, useEffect } from "react";
import { CircleCheck, CircleX, Loader2 } from "lucide-react";

interface ApiHealthProps {
  className?: string;
}

type HealthStatus = "checking" | "healthy" | "unhealthy";

export default function ApiHealth({ className = "" }: ApiHealthProps) {
  const [status, setStatus] = useState<HealthStatus>("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  
  const checkHealth = async () => {
    setStatus("checking");
    try {
      const response = await fetch("/api/proxy/docs", { method: "HEAD" });
      setStatus(response.ok ? "healthy" : "unhealthy");
    } catch {
      setStatus("unhealthy");
    }
    setLastCheck(new Date());
  };
  
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);
  
  const getIcon = () => {
    switch (status) {
      case "checking":
        return <Loader2 size={12} className="animate-spin text-yellow-500" />;
      case "healthy":
        return <CircleCheck size={12} className="text-green-500" />;
      case "unhealthy":
        return <CircleX size={12} className="text-red-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Checking...";
      case "healthy":
        return "Backend Online";
      case "unhealthy":
        return "Backend Offline";
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "checking":
        return "text-yellow-600";
      case "healthy":
        return "text-green-600";
      case "unhealthy":
        return "text-red-600";
    }
  };
  
  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      {getIcon()}
      <span className={`font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {status === "unhealthy" && (
        <button
          onClick={checkHealth}
          className="rounded px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Retry
        </button>
      )}
      {lastCheck && (
        <span className="text-zinc-400">
          • {lastCheck.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}