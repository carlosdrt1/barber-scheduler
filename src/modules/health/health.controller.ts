import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Controller('health')
export class HealthControler {
  constructor(private readonly prismaService: PrismaService) {}

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
