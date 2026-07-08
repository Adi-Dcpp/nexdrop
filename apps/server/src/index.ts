import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());
app.get('/health', (_request, response) => response.json({ ok: true }));

const server = createServer(app);
new Server(server, { cors: { origin: true, credentials: true } });

const port = Number(process.env.PORT ?? 3001);
server.listen(port, () => {
  console.log(`NexDrop signaling server running on http://localhost:${port}`);
});