import { Module } from '@nestjs/common';
import { HealthControler } from './health.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthControler],
})
export class HealthModule {}
