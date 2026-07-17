import 'fastify';
import { UserPayload } from '@/auth/types/user-payload.types';

declare module 'fastify' {
  interface FastifyRequest {
    user: UserPayload;
  }
}
