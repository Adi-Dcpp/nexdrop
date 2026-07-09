export const SocketEvents = {
  ROOM_CREATE: "room:create",
  ROOM_CREATED: "room:created",

  ROOM_JOIN: "room:join",
  ROOM_JOINED: "room:joined",

  ROOM_FULL: "room:full",

  PEER_JOINED: "peer:joined",
  PEER_LEFT: "peer:left",

  SIGNAL_OFFER: "signal:offer",
  SIGNAL_ANSWER: "signal:answer",
  SIGNAL_ICE: "signal:ice-candidate",

  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVED: "message:received",

  TRANSFER_CANCEL: "transfer:cancel",
  TRANSFER_STATUS: "transfer:status",

  ERROR: "error",
} as const;