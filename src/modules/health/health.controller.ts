import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthControler {
  @Get()
  health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
