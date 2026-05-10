import jwt from 'jsonwebtoken';
import type { Server, Socket } from 'socket.io';

interface AuthSocket extends Socket {
  user?: jwt.JwtPayload;
}

export function setupSocket(io: Server): void {
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) { next(); return; }
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as jwt.JwtPayload;
      next();
    } catch {
      next();
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    socket.on('order:join', (orderId: string) => socket.join(`order:${orderId}`));
  });
}
