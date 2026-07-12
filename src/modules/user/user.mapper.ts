import { User } from 'src/generated/prisma/client';
import { UserResponseDto } from './dto/user-response.dto';

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
