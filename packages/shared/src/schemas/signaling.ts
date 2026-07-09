import { z } from "zod";

export const OfferSchema = z.object({
  roomId: z.string(),
  from: z.string(),
  sdp: z.any(),
});

export const AnswerSchema = OfferSchema;

export const IceCandidateSchema = z.object({
  roomId: z.string(),
  from: z.string(),
  candidate: z.any(),
});