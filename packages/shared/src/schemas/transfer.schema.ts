import { z } from "zod";

export const TransferSchema = z.object({
  id: z.string(),

  roomId: z.string(),

  senderId: z.string(),

  receiverId: z.string(),

  fileName: z.string(),

  mimeType: z.string(),

  fileSize: z.number().positive(),

  chunkSize: z.number().positive(),

  chunkCount: z.number().positive(),

  receivedBytes: z.number(),

  status: z.enum([
    "pending",
    "transferring",
    "paused",
    "completed",
    "cancelled",
    "failed",
  ]),

  sha256: z.string().optional(),

  startedAt: z.number(),

  completedAt: z.number().optional(),
});