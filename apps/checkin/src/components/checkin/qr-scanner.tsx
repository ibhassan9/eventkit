"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@eventkit/ui/button";

interface QrScannerProps {
  active: boolean;
  onToggle: () => void;
  onScan: (data: string) => void;
}

export function QrScanner({ active, onToggle, onScan }: QrScannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<import("html5-qrcode").Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastScanRef = useRef<string>("");
  const lastScanTimeRef = useRef<number>(0);

  const handleScan = useCallback(
    (decodedText: string) => {
      const now = Date.now();
      if (
        decodedText === lastScanRef.current &&
        now - lastScanTimeRef.current < 3000
      ) {
        return;
      }
      lastScanRef.current = decodedText;
      lastScanTimeRef.current = now;
      onScan(decodedText);
    },
    [onScan]
  );

  useEffect(() => {
    if (!active || !containerRef.current) return;

    let scanner: import("html5-qrcode").Html5Qrcode | null = null;

    async function startScanner() {
      const { Html5Qrcode } = await import("html5-qrcode");
      const containerId = "qr-scanner-container";

      scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      setError(null);

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          handleScan,
          () => {}
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start camera. Please check permissions."
        );
      }
    }

    startScanner();

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(() => {});
      }
      scannerRef.current = null;
    };
  }, [active, handleScan]);

  return (
    <div className="space-y-3">
      <Button
        variant={active ? "destructive" : "default"}
        size="lg"
        className="h-14 w-full text-lg font-bold"
        onClick={onToggle}
      >
        {active ? (
          <>
            <CameraOff className="mr-2 h-6 w-6" />
            Stop Scanner
          </>
        ) : (
          <>
            <Camera className="mr-2 h-6 w-6" />
            Scan QR Code
          </>
        )}
      </Button>

      <div
        style={{ display: active ? "block" : "none" }}
        className="overflow-hidden rounded-xl border-2 border-dashed border-primary/30"
      >
        <div id="qr-scanner-container" ref={containerRef} />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-center text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
