import { z } from "zod";

export const PeerSchema = z.object({
  id: z.string(),

  roomId: z.string(),

  displayName: z.string(),

  deviceType: z.enum([
    "desktop",
    "mobile",
    "tablet",
    "unknown",
  ]),

  connectionState: z.enum([
    "connecting",
    "connected",
    "disconnected",
  ]),

  connectedAt: z.number(),

  lastSeenAt: z.number(),
});