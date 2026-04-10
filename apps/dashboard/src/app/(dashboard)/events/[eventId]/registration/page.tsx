import { RegistrationBuilderClient } from "./registration-builder-client";

export default async function RegistrationBuilderPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return <RegistrationBuilderClient eventId={eventId} />;
}
