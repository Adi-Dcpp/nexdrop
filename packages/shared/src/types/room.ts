import type { PeerId, RoomId } from "./ids";

export type RoomStatus =
  | "waiting"
  | "active"
  | "expired"
  | "closed";

export interface Room {
  id: RoomId;
  peers: PeerId[];
  status: RoomStatus;
  createdAt: number;
  expiresAt: number;
}