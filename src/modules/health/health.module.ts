import { Module } from '@nestjs/common';
import { HealthControler } from './health.controller';

@Module({
  controllers: [HealthControler],
})
export class HealthModule {}
