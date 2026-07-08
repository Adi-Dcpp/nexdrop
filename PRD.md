# Product Requirements Document: NexDrop

## 1. Executive Summary

NexDrop is a production-quality peer-to-peer file sharing web application that enables users to transfer files directly between browsers using WebRTC Data Channels. The product is designed to be fast, private, and frictionless: users open the site, create or join a room, connect with another device, and exchange files without uploading the payload to any server.

The backend is intentionally narrow in scope. It exists only to facilitate signaling, room coordination, and lifecycle management. It must never receive file bytes, store files, or become part of the data transfer path. This architecture makes the product privacy-first by design while preserving the performance advantages of direct browser-to-browser transfer.

NexDrop targets users who want a modern alternative to Snapdrop, PairDrop, Wormhole, and LocalSend, with a strong emphasis on browser compatibility, mobile support, and a polished real-time experience.

## 2. Vision

Build the fastest, simplest, and most privacy-preserving way to send files directly between browsers without uploading them to a central server.

The product should feel instant, trustworthy, and modern, while supporting real-world transfer workloads and clear paths toward production scaling.

## 3. Problem Statement

Current file sharing workflows often force users into one of three poor options:

- Cloud storage links that require uploads, account creation, and trust in a third-party storage layer.
- Native app-based transfer tools that are fragmented across operating systems and often unavailable in browser-first workflows.
- Legacy sharing tools that are fast but inconsistent, limited in scale, or weak on UX and mobile support.

Users need a browser-native way to move files between devices with minimal setup, no account friction, and strong privacy guarantees. They also need confidence that the service provider cannot access the file contents.

## 4. Goals

- Enable browser-to-browser file transfer with no server-side file storage.
- Use WebRTC and RTCDataChannel for the actual data path.
- Keep the signaling server out of the file transfer path.
- Provide a beautiful, intuitive, mobile-friendly UI.
- Support link and QR-based sharing for fast room joining.
- Deliver production-grade reliability, security, and observability.
- Build the system so it can scale horizontally as signaling demand grows.

## 5. Non-Goals

The product should not:

- Store user files in the backend.
- Act as cloud storage or a file repository.
- Require user accounts for the MVP.
- Sync files across devices.
- Permanently save transfer history.
- Process uploaded files on the server.

## 6. User Personas

### 6.1 Developer
Needs to quickly send code, screenshots, build artifacts, or logs between laptop and mobile without dependencies on cloud storage.

### 6.2 Student
Wants to share assignments, notes, and media with classmates using only a browser and a link or QR code.

### 6.3 Professional
Transfers documents and presentations between work devices while maintaining privacy and minimizing tool friction.

### 6.4 Remote Worker
Moves files between personal and work devices, often across networks, with a preference for secure, low-latency transfers.

### 6.5 Privacy-Conscious User
Cares deeply that files are never stored or inspected by the service provider and prefers browser-native workflows.

## 7. User Stories

- As a sender, I want to create a room and share it quickly so another device can connect.
- As a receiver, I want to join a room by link or QR code so I can start receiving files immediately.
- As a sender, I want to select one or more files and transfer them without opening another app.
- As a sender, I want to see transfer progress, speed, and ETA so I know whether the transfer is healthy.
- As a receiver, I want received files to download automatically or with one click.
- As a user, I want to cancel a transfer if I chose the wrong file or no longer need it.
- As a user, I want text chat so I can coordinate what I am sending.
- As a mobile user, I want the interface to work well on small screens and in portrait mode.
- As a privacy-conscious user, I want assurance that the server never sees file contents.

## 8. Functional Requirements

### 8.1 MVP Requirements

- Create room.
- Join room.
- Establish peer connection.
- Send text messages.
- Transfer files.
- Transfer multiple files.
- Show progress indicator.
- Show transfer speed.
- Show ETA.
- Cancel transfer.
- Support drag and drop file selection.
- Copy room link.
- Generate QR code for room sharing.
- Download received files.
- Support dark mode.

### 8.2 Advanced Features

- Folder transfer.
- Pause and resume transfer.
- Transfer queue.
- Simultaneous transfers.
- Multi-peer rooms.
- Broadcast transfer.
- Clipboard sharing.
- Device discovery.
- LAN mode.
- Transfer history.
- Mobile optimization enhancements.
- PWA support.
- Offline-capable shell.

## 9. Non-Functional Requirements

### 9.1 Performance

- Room connection setup should complete in under 3 seconds in typical network conditions.
- The UI must remain responsive during large transfers.
- Memory usage should remain bounded and should avoid unnecessary copies and large retained buffers.
- Transfers should support files significantly larger than available RAM, subject to browser and storage constraints.
- Streaming and chunk scheduling must keep UI blocking to a minimum.
- Progress updates should remain smooth even under sustained transfer load.

### 9.2 Reliability

- Signaling should tolerate transient disconnects and reconnect attempts.
- Room expiration should prevent stale sessions from accumulating indefinitely.
- Invalid or malformed signaling messages should be rejected safely.

### 9.3 Scalability

- The signaling backend should support thousands of concurrent rooms.
- The architecture should support horizontal scaling and a Redis adapter in later phases.

### 9.4 Maintainability

- Use modular code with clear separation between UI, transport, protocol, and domain logic.
- Shared protocol definitions should live in a dedicated package.
- Validate all external inputs at boundaries.
- Design the transfer engine around a storage abstraction so implementations can evolve without changing transfer logic.

### 9.5 Reliability and Recovery

- The application must behave as a reliable peer-to-peer transfer platform, not a demo.
- Reliability, fault tolerance, and extensibility must be core architectural goals.
- Interrupted transfers must be resumable after browser refresh, browser crash, network interruption, or temporary peer disconnect.
- Transfer state must survive browser restarts when persisted data is still available.
- Completed or abandoned transfers must be cleaned up on a configurable retention policy.

### 9.6 Accessibility and Compatibility

- The UI should be keyboard accessible.
- The product should work on modern desktop browsers and mobile browsers.
- Responsive layouts must handle small screens, portrait orientation, and touch interactions.
- The application should automatically select the best available storage mechanism based on browser capabilities while preserving identical transfer behavior.

## 10. UX Requirements

- The first-use path should be obvious within seconds of landing on the app.
- The primary CTA should make creating or joining a room unambiguous.
- Room links and QR codes should be easy to share and scan.
- Transfers should show clear state changes: connecting, ready, sending, receiving, complete, failed, canceled.
- Visual feedback should make connection state and transfer health understandable without reading logs.
- The design should feel modern, lightweight, and trustworthy.
- Dark mode should be available from MVP.
- Mobile layouts should avoid dense controls and preserve one-handed usability.

## 11. System Architecture

### 11.1 High-Level Architecture

1. User opens the website.
2. User creates or joins a room.
3. Socket.io establishes signaling between peers and server.
4. Peers exchange SDP offer, SDP answer, and ICE candidates.
5. RTCPeerConnection is established.
6. RTCDataChannel opens.
7. File transfer occurs directly between peers.
8. The server is no longer involved in the file data path.

### 11.2 Core Components

- Frontend web client in React and TypeScript.
- Signaling server in Node.js, Express, Socket.io, and TypeScript.
- Shared package for types, constants, validation schemas, and signaling protocol definitions.
- Browser-native WebRTC transport layer.

### 11.3 Server Responsibilities

The server only performs signaling and session coordination.

Responsibilities:

- Create rooms.
- Join rooms.
- Relay SDP offers.
- Relay SDP answers.
- Relay ICE candidates.
- Handle disconnect events.
- Manage room expiration and cleanup.
- Apply rate limits and input validation.

The server must never:

- Receive file chunks.
- Receive binary payloads.
- Store uploaded files.
- Process file contents.

### 11.4 Client Responsibilities

- Create or join rooms.
- Manage WebRTC lifecycle.
- Manage DataChannel lifecycle.
- Select files.
- Chunk files.
- Send chunks.
- Receive chunks.
- Track progress and speed.
- Reconstruct files.
- Trigger download generation.
- Handle errors and retry states.

## 12. Networking Architecture

- WebRTC is the transport for file and message data.
- Socket.io is the transport for signaling only.
- STUN servers are used for NAT traversal.
- TURN support is reserved for future versions to improve connectivity in restrictive network environments.
- All sensitive signaling data should be validated before use.
- The server should support ephemeral room membership and disconnect cleanup.

## 13. WebRTC Flow

1. Sender creates a room and becomes the room initiator.
2. Receiver joins the room through a link, QR code, or room ID.
3. One peer creates an RTCPeerConnection.
4. The initiator creates and sends an SDP offer.
5. The other peer responds with an SDP answer.
6. Both sides exchange ICE candidates.
7. Once ICE negotiation succeeds, the peer connection becomes stable.
8. A RTCDataChannel opens for text and file transfer.
9. Payloads are exchanged directly between browsers.

## 14. Signaling Flow

### 14.1 Events

- Room creation.
- Room join.
- Offer exchange.
- Answer exchange.
- ICE candidate relay.
- Peer disconnect.
- Room expiration.

### 14.2 Requirements

- Signaling messages must be schema-validated.
- Room IDs must be random and difficult to guess.
- The server should not persist room state longer than necessary.
- Reconnection behavior should preserve room identity only within an active session window.

## 15. File Transfer Protocol

### 15.1 Pipeline

1. User selects one or more files.
2. Browser reads the file incrementally using the File API.
3. The sender streams the file without loading it fully into memory.
4. File data is split into configurable chunks, with a default chunk size of 64 KB.
5. Chunks are sent over RTCDataChannel.
6. Receiver persists each chunk immediately to the configured storage provider.
7. When all chunks arrive, receiver reorders them if needed.
8. Receiver reconstructs the file into a Blob, streamed download, or direct destination file.
9. Receiver downloads the file locally or writes it directly to persistent storage when supported.

### 15.2 Transfer Reliability

- The application must be designed as a reliable peer-to-peer file transfer platform rather than a simple demo.
- Each transfer should maintain its own independent state machine.
- A Transfer Manager should coordinate scheduling, progress tracking, cancellation, retry logic, pause/resume, and completion.
- The scheduler should prevent any single transfer from monopolizing the RTCDataChannel.

### 15.3 Streaming Architecture

- The application must never load an entire file into memory.
- Files must be processed as streams and divided into configurable chunks.
- Only a small number of chunks should exist in memory at any given time.
- The sender should read the original file incrementally using the File API instead of converting the entire file into a single ArrayBuffer.

### 15.4 Storage Abstraction

- The transfer engine must use a Storage Provider abstraction rather than directly interacting with browser storage.
- The Storage Provider should support implementations such as Memory, IndexedDB, and File System Access API.
- The transfer engine must remain independent of the underlying storage implementation.

### 15.5 Persistent Chunk Storage

- Received chunks must be written to persistent browser storage immediately after arrival instead of remaining only in RAM.
- The default persistent storage mechanism should be IndexedDB.
- If the browser supports the File System Access API, the application should allow writing incoming chunks directly to the destination file for improved performance and support for very large files.

### 15.6 Crash Recovery

- The application must support resuming interrupted transfers after browser crash, browser refresh, network interruption, or temporary peer disconnect.
- Transfer state must survive browser restarts.
- The application should restore all incomplete transfers from persistent storage when reopened.

### 15.7 Resume Protocol

- Each transfer must have a globally unique Transfer ID.
- The receiver must persist transfer metadata including:
  - Transfer ID.
  - Filename.
  - MIME type.
  - File size.
  - Chunk size.
  - Total chunks.
  - Received chunk bitmap.
  - SHA-256 checksum.
  - Last completed chunk.
  - Current transfer state.
  - Timestamps.
- Upon reconnection:
  1. Receiver restores transfer metadata.
  2. Receiver informs the sender which chunks have already been received.
  3. Sender resumes transmission beginning with the first missing chunk.
  4. Previously received chunks must never be retransmitted unless explicitly requested.

### 15.8 Chunk Format

- Every transmitted chunk must include:
  - Transfer ID.
  - Chunk Index.
  - Total Chunks.
  - Payload Length.
  - Binary Payload.
- This ensures multiple simultaneous transfers can coexist without ambiguity.

### 15.9 Multiple Concurrent Transfers

- The application must support multiple simultaneous file transfers.
- Each transfer should maintain its own independent state machine.
- A Transfer Manager should coordinate scheduling, progress tracking, cancellation, retry logic, pause/resume, and completion.
- The scheduler should prevent any single transfer from monopolizing the RTCDataChannel.

### 15.10 Flow Control

- Transmission must implement backpressure using RTCDataChannel.bufferedAmount.
- The sender should automatically pause when the send buffer exceeds a configurable threshold and resume once sufficient buffer space becomes available.
- The implementation must avoid excessive browser memory usage.

### 15.11 Data Integrity

- Every completed transfer must be verified using SHA-256.
- The sender computes the hash before transmission.
- The receiver computes the hash after reconstruction.
- The transfer is considered successful only if both hashes match.

### 15.12 Cleanup

- Completed transfers should automatically remove temporary chunk data and metadata from persistent storage.
- Abandoned transfers should expire after a configurable timeout.

### 15.13 Extensibility

- The architecture should be modular and extensible to support folder transfer, transfer queue, concurrent transfers, adaptive chunk sizing, compression, end-to-end application-level encryption, transfer prioritization, bandwidth throttling, transfer history, device discovery, LAN mode, multi-peer transfers, and broadcast transfers as core system capabilities.

### 15.14 Transfer Control

- The sender should monitor RTCDataChannel.bufferedAmount to avoid uncontrolled buffering.
- Backpressure handling should pause or slow chunk emission when the channel is congested.
- Chunk sizing should be adjustable in future versions for adaptive optimization.

### 15.15 Integrity

- The transfer pipeline should use WebRTC transport integrity, metadata validation, and the required SHA-256 verification defined above.
- Additional authenticity or tamper-detection mechanisms may be introduced later, but they must not replace SHA-256 verification.

## 16. Security Requirements

- WebRTC transport must use DTLS encryption.
- Signaling messages must be validated and sanitized.
- Rooms should expire automatically after inactivity.
- Room identifiers should be unguessable random strings.
- Rate limiting should protect the signaling layer from abuse.
- Secure headers should be enabled on the web frontend.
- File metadata must be validated before display or download handling.
- The server must never inspect or relay file bytes.
- Optional future end-to-end encryption can be layered above WebRTC using a shared secret.

## 17. API Design

### 17.1 HTTP API

The backend HTTP surface should remain minimal. It may include:

- Health check endpoint.
- Room metadata endpoint if needed for debugging or lightweight status.
- Static delivery or reverse-proxy support depending on deployment.

The canonical signaling channel should remain Socket.io rather than expanding into a large REST surface.

### 17.2 API Principles

- Keep the public API minimal.
- Prefer schema validation at the boundary.
- Avoid exposing internal room state beyond what is required for coordination.
- Do not introduce endpoints that accept file uploads.

## 18. Socket.io Events

### 18.1 Client to Server

- `room:create`
- `room:join`
- `signal:offer`
- `signal:answer`
- `signal:ice-candidate`
- `peer:disconnect`
- `transfer:cancel`
- `message:send`

### 18.2 Server to Client

- `room:created`
- `room:joined`
- `room:full`
- `room:expired`
- `peer:joined`
- `peer:left`
- `signal:offer`
- `signal:answer`
- `signal:ice-candidate`
- `message:received`
- `transfer:status`
- `error`

### 18.3 Event Requirements

- All events should be typed and validated in the shared package.
- Error payloads should be structured and user-friendly.
- Events should avoid transporting any file chunk payloads through the server.

## 19. Data Models

### 19.1 Room

- `roomId`
- `createdAt`
- `expiresAt`
- `peerCount`
- `status`

### 19.2 Peer Session

- `peerId`
- `roomId`
- `connectedAt`
- `lastSeenAt`
- `deviceType`
- `connectionState`

### 19.3 Transfer

- `transferId`
- `roomId`
- `senderPeerId`
- `receiverPeerId`
- `fileName`
- `mimeType`
- `fileSize`
- `chunkSize`
- `chunkCount`
- `receivedBytes`
- `status`
- `startedAt`
- `completedAt`
- `canceledAt`

### 19.4 Chunk Descriptor

- `transferId`
- `fileId`
- `chunkIndex`
- `totalChunks`
- `payload`

## 20. Component Breakdown

### 20.1 Frontend

- Landing page.
- Room creation and join controls.
- QR code display component.
- Connection status panel.
- File picker and drag-and-drop zone.
- Transfer queue view.
- Transfer progress card.
- Peer status indicator.
- Toast and error messaging layer.
- Theme toggle.

### 20.2 Transport Layer

- WebRTC connection manager.
- DataChannel manager.
- Signaling client.
- Transfer encoder and decoder.
- Chunk scheduler and backpressure handler.
- Transfer Manager.
- Resume coordinator.
- Storage Provider abstraction.
- Persistent chunk writer.

### 20.3 State Management

- UI state.
- Room state.
- Peer connection state.
- Transfer queue state.
- Theme preference state.
- Transfer recovery state.

### 20.4 Backend

- Express app shell.
- Socket.io signaling gateway.
- Room lifecycle service.
- Validation middleware.
- Rate limiting middleware.
- Logging and observability hooks.

## 21. Project Folder Structure

The codebase should use a monorepo.

```text
apps/
  client/
  server/

packages/
  shared/
```

### 21.1 `apps/client`

- React application.
- WebRTC UI and client-side transport.
- File transfer presentation and state.

### 21.2 `apps/server`

- Node.js signaling server.
- Socket.io event handling.
- Room lifecycle and validation.

### 21.3 `packages/shared`

- Shared types.
- Signaling protocol definitions.
- Constants.
- Validation schemas.

## 22. Development Roadmap

### Phase 1: MVP Foundation

- Set up monorepo and shared package.
- Build landing page and room join flow.
- Implement room creation and signaling.
- Establish peer connection and DataChannel.
- Add text messaging.
- Add single-file streaming transfer.
- Add persistent chunk storage.
- Add file progress UI.
- Add download handling.
- Add resume-capable transfer metadata persistence.

### Phase 2: Product Completeness

- Support multiple files.
- Add drag and drop.
- Add QR code sharing.
- Add cancel transfer.
- Add ETA and speed metrics.
- Add dark mode and mobile polish.
- Add error handling and reconnect states.
- Add crash recovery and transfer restore.
- Add multiple concurrent transfers.

### Phase 3: Production Hardening

- Add rate limiting and security headers.
- Add room expiration and cleanup.
- Add structured logging and metrics.
- Add load testing and connection resilience improvements.
- Add adaptive chunking and backpressure handling.
- Add SHA-256 integrity verification.
- Add File System Access API integration.

### Phase 4: Scale and Advanced Capabilities

- Add Redis adapter for signaling scale-out.
- Add TURN support.
- Add folder transfer and resumable transfers.
- Add PWA support and offline shell.
- Add multi-peer and broadcast features.
- Add transfer prioritization and bandwidth throttling.
- Add compression and application-level encryption options.

## 23. Milestones

### Milestone 1
Clickable room creation and join flow with signaling-only backend.

### Milestone 2
Stable peer connection with text messaging over RTCDataChannel.

### Milestone 3
Single-file transfer with progress, speed, ETA, and cancellation.

### Milestone 4
Multi-file transfer, QR sharing, drag and drop, and mobile-ready UI.

### Milestone 5
Security hardening, observability, and production deployment readiness.

### Milestone 6
Scalable signaling architecture and advanced transfer capabilities.

## 24. Risks

- NAT traversal may fail in restrictive networks without TURN.
- Large-file transfers may create memory pressure in browsers if buffering is not carefully managed.
- Mobile browsers may impose stricter resource limits and backgrounding behavior.
- WebRTC interoperability can vary between browsers and devices.
- Poor input validation on signaling messages could cause instability or abuse.
- Users may misunderstand direct transfer semantics unless the privacy model is clearly communicated.
- Multi-peer and resumable transfers add protocol complexity.

## 25. Future Improvements

- Additional UX refinements for advanced sharing and recovery flows.
- Expanded observability and operational tooling for large deployments.
- More aggressive optimizations for zero-copy paths where browser APIs allow.
- Additional network fallback strategies for restricted environments.

The core architecture should already support reliability, resumability, persistent chunk storage, and modular extensibility; these items are future product accelerators rather than foundational requirements.

## 26. Success Metrics

- Room creation to successful connection under 3 seconds for the majority of sessions.
- High completion rate for transfers under typical consumer network conditions.
- Low transfer failure rate due to signaling or connection setup issues.
- Strong mobile usage retention and low abandonment during join flow.
- Positive user feedback on speed, simplicity, and trustworthiness.
- High percentage of successful transfers without server-side fallback.

## 27. Open Questions

- Should the MVP support one-to-one transfers only, or should the room model anticipate multi-peer from day one?
- Should file transfer metadata be displayed before acceptance on the receiver side for additional safety?
- Should link sharing and QR sharing share the same room join path or remain separate UX entry points?
- Should the product include optional password protection for rooms in the first production release?
- What is the minimum acceptable fallback strategy when direct peer connectivity fails and TURN is not yet available?
- Should the app support receive-acceptance gating by default for privacy and spam resistance?
- Should the first production deployment prioritize Vercel/Cloudflare Pages plus Railway/Render, or a Docker VPS reference deployment?

## 28. Implementation Principles

- Keep signaling and file transport strictly separated.
- Treat the client as the owner of transfer state and reconstruction.
- Validate every external payload at the boundary.
- Favor small, composable modules over tightly coupled abstractions.
- Optimize for browser-native primitives before adding custom infrastructure.
- Preserve privacy guarantees in both product copy and technical design.
- Design for eventual scale without sacrificing MVP simplicity.
