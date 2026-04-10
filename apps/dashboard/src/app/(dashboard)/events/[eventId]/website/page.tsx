import { WebsiteEditorClient } from "./website-editor-client";

export default async function WebsiteEditorPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return <WebsiteEditorClient eventId={eventId} />;
}
