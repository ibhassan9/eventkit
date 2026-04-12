import QRCode from "qrcode";

export async function generateQRDataUrl(
  data: string,
  foreground?: string,
  background?: string
): Promise<string> {
  return QRCode.toDataURL(data, {
    width: 300,
    margin: 1,
    color: {
      dark: foreground ?? "#000000",
      light: background ?? "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
}
