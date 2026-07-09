import { z } from "zod";

export const RoomSchema = z.object({
  id: z.string(),

  peers: z.array(z.string()),

  status: z.enum([
    "waiting",
    "active",
    "expired",
    "closed",
  ]),

  createdAt: z.number(),

  expiresAt: z.number(),
});