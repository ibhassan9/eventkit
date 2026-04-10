import { cache } from "react";
import { getEventBySlug } from "@eventkit/db/queries";

export const getEvent = cache(async (slug: string) => getEventBySlug(slug));
