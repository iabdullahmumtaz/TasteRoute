import type { Server as SocketIOServer } from 'socket.io';
import type { IUserDocument } from '../models/User.js';

declare global {
  namespace Express {
    interface Application {
      get(name: 'io'): SocketIOServer | undefined;
      set(name: 'io', value: SocketIOServer): void;
    }
    interface Request {
      user?: IUserDocument;
    }
  }
}
export {};
