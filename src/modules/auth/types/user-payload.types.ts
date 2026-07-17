import { Role } from 'src/generated/prisma/enums';

export type UserPayload = {
  id: string;
  role: Role;
};
