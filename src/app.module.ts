import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ConfigModule } from '@nestjs/config';
import { configSchema } from './config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: configSchema }),
    HealthModule,
  ],
})
export class AppModule {}
