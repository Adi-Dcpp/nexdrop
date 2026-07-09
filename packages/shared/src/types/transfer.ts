import type { PeerId, RoomId, TransferId } from "./ids";

export type TransferStatus =
  | "pending"
  | "transferring"
  | "paused"
  | "completed"
  | "cancelled"
  | "failed";

export interface Transfer {
  id: TransferId;
  roomId: RoomId;

  senderId: PeerId;
  receiverId: PeerId;

  fileName: string;
  mimeType: string;

  fileSize: number;

  chunkSize: number;
  chunkCount: number;

  receivedBytes: number;

  status: TransferStatus;

  sha256?: string;

  startedAt: number;
  completedAt?: number;
}