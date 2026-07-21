import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('health')
export class HealthControler {
  constructor(private readonly prismaService: PrismaService) {}

  @Public()
  @Get()
  async health() {
    await this.prismaService.$queryRaw`SELECT 1`;

    return {
      status: 'ok',
      database: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
