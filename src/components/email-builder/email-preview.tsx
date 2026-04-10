"use client";

import { getMergeTagSampleValues } from "@/lib/email/merge-tags";

interface EmailPreviewProps {
  subject: string;
  body: string;
}

function replaceTags(text: string, values: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

export function EmailPreview({ subject, body }: EmailPreviewProps) {
  const sampleValues = getMergeTagSampleValues();
  const previewSubject = replaceTags(subject, sampleValues);
  const previewBody = replaceTags(body, sampleValues);

  return (
    <div className="rounded-md border bg-white">
      <div className="border-b px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground">Preview</p>
        <p className="mt-1 text-sm font-semibold">{previewSubject || "No subject"}</p>
      </div>
      <div
        className="prose prose-sm max-w-none p-4"
        dangerouslySetInnerHTML={{ __html: previewBody }}
      />
    </div>
  );
}
