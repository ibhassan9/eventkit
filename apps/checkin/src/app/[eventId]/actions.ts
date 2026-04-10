"use server";

import { z } from "zod";
import { createPublicAction } from "@eventkit/lib/safe-action";
import {
  performCheckInLogic,
  searchForAttendeesLogic,
  lookupQrCodeLogic,
  fetchCheckinStatsLogic,
} from "@eventkit/lib/checkin";

const checkInSchema = z.object({
  attendeeId: z.string().uuid(),
  eventId: z.string().uuid(),
});

export const performCheckIn = createPublicAction(
  checkInSchema,
  performCheckInLogic
);

const searchSchema = z.object({
  eventId: z.string().uuid(),
  query: z.string().min(2).max(100),
});

export const searchForAttendees = createPublicAction(
  searchSchema,
  searchForAttendeesLogic
);

const qrLookupSchema = z.object({
  qrCode: z.string().min(1),
  eventId: z.string().uuid(),
});

export const lookupQrCode = createPublicAction(
  qrLookupSchema,
  lookupQrCodeLogic
);

const statsSchema = z.object({
  eventId: z.string().uuid(),
});

export const fetchCheckinStats = createPublicAction(
  statsSchema,
  fetchCheckinStatsLogic
);
