import type { PeerId, RoomId } from "./ids";

export interface OfferPayload {
  roomId: RoomId;
  from: PeerId;
  sdp: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  roomId: RoomId;
  from: PeerId;
  sdp: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  roomId: RoomId;
  from: PeerId;
  candidate: RTCIceCandidateInit;
}