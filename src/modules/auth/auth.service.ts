import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
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
import { LoginDto } from './dto/login.dto';
import { UserPayload } from './types/user-payload.types';
import { JwtService } from '@nestjs/jwt';

const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$Fp7l8l4+6T1luOsg5fsp5A$jvBoSIwasqxFDV1aqDjHv5VG7QQakoADZbuECX1R2jM';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<UserResponseDto> {
    const identifier = this.normalizeIdentifier(data.identifier);

    const exist = await this.findUserByIdentifier(identifier.value);
    if (exist) {
      throw new ConflictException('Email or phone already taken');
    }

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

  async login(data: LoginDto): Promise<{ user: UserResponseDto; access_token: string }> {
    const identifier = this.normalizeIdentifier(data.identifier);
    const user = await this.findUserByIdentifier(identifier.value);

    const hash = user?.password || DUMMY_HASH;
    const verify = await argon2.verify(hash, data.password);

    if (!user || !verify) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = { id: user.id, role: user.role };

    return {
      user: UserMapper.toResponse(user),
      access_token: await this.jwtService.signAsync(payload),
    };
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

  private async findUserByIdentifier(identifier: string): Promise<User | null> {
    return this.prismaService.user.findFirst({
      where: { OR: [{ email: identifier }, { phone: identifier }] },
    });
  }
}
