import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { isEmail, isPhoneNumber } from 'class-validator';
import { Role } from 'src/generated/prisma/enums';
import { UserCreateInput } from 'src/generated/prisma/models';
import { User } from 'src/generated/prisma/client';
import { UserMapper } from '../user/user.mapper';
import { UserResponseDto } from '../user/dto/user-response.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async register(data: RegisterDto): Promise<UserResponseDto> {
    const identifier = this.normalizeIdentifier(data.identifier);
    await this.verifyIdentifierDisponibility(identifier.value);

    const password = await argon2.hash(data.password);
    const createData: UserCreateInput = {
      name: data.name,
      role: Role.CLIENT,
      password,
    };

    let user: User;
    if (identifier.type === 'email') {
      createData.email = identifier.value;
      user = await this.prismaService.user.create({ data: createData });
    } else {
      createData.phone = identifier.value;
      user = await this.prismaService.user.create({ data: createData });
    }

    return UserMapper.toResponse(user);
  }

  private normalizeIdentifier(identifier: string): {
    type: 'email' | 'phone';
    value: string;
  } {
    if (isEmail(identifier)) {
      return { type: 'email', value: identifier.toLowerCase() };
    }

    const phone = identifier.replace(/\D/g, '');
    if (isPhoneNumber(phone, 'BR')) {
      return { type: 'phone', value: identifier };
    }

    throw new BadRequestException('Invalid identifier');
  }

  private async verifyIdentifierDisponibility(
    identifier: string,
  ): Promise<void> {
    const user = await this.prismaService.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });

    if (user) {
      throw new ConflictException('Email or phone already taken');
    }
  }
}
