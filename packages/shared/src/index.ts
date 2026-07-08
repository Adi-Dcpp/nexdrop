export type TransferState = 'idle' | 'connecting' | 'transferring' | 'paused' | 'completed' | 'failed';

export interface RoomInfo {
  roomId: string;
  createdAt: string;
}