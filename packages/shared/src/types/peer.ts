import type { PeerId, RoomId } from "./ids";

export type DeviceType = "desktop" | "mobile" | "tablet" | "unknown";

export type ConnectionState =
  | "connecting"
  | "connected"
  | "disconnected";

export interface Peer {
  id: PeerId;
  roomId: RoomId;
  displayName: string;
  deviceType: DeviceType;
  connectionState: ConnectionState;
  connectedAt: number;
  lastSeenAt: number;
}