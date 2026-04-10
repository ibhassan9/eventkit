"use client";

import { useEffect, useState } from "react";

interface QrCodeDisplayProps {
  qrCode: string;
}

export function QrCodeDisplay({ qrCode }: QrCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    async function generate() {
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(qrCode, {
          width: 200,
          margin: 2,
          color: { dark: "#000000", light: "#FFFFFF" },
        });
        setDataUrl(url);
      } catch {
        // QR generation failure is non-critical
      }
    }
    generate();
  }, [qrCode]);

  if (!dataUrl) return null;

  return (
    <div className="mt-6 flex justify-center">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <img
          src={dataUrl}
          alt="Registration QR Code"
          width={180}
          height={180}
          className="mx-auto"
        />
        <p className="mt-2 text-xs text-zinc-400">
          Show this at check-in
        </p>
      </div>
    </div>
  );
}
