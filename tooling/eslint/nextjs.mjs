import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

export function createNextConfig(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = dirname(__filename);
  const compat = new FlatCompat({ baseDirectory: __dirname });

  return [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
      ignores: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "build/**",
        "dist/**",
        "next-env.d.ts",
      ],
    },
  ];
}
