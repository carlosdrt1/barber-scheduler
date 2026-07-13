import { Role } from 'src/generated/prisma/enums';

export class UserResponseDto {
  name: string;
  email: string | null;
  phone: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
