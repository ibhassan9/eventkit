import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  getEventById,
  getBadgeTemplateById,
  getAttendeesByEventId,
  getOrganizationByClerkUserId,
} from "@/db/queries";
import { generateBadgePdf } from "@/lib/badges/generate-pdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const org = await getOrganizationByClerkUserId(userId);
  if (!org) {
    return NextResponse.json(
      { error: "Organization not found" },
      { status: 403 }
    );
  }

  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event || event.organizationId !== org.id) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const templateId = request.nextUrl.searchParams.get("templateId");
  if (!templateId) {
    return NextResponse.json(
      { error: "templateId is required" },
      { status: 400 }
    );
  }

  const template = await getBadgeTemplateById(templateId);
  if (!template) {
    return NextResponse.json(
      { error: "Badge template not found" },
      { status: 404 }
    );
  }

  const attendees = await getAttendeesByEventId(eventId);
  if (attendees.length === 0) {
    return NextResponse.json(
      { error: "No attendees found for this event" },
      { status: 404 }
    );
  }

  const pdfBuffer = await generateBadgePdf(
    template.config,
    attendees,
    event
  );

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="badges-${event.slug}.pdf"`,
    },
  });
}
