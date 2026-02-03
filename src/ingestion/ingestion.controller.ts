import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('meter')
  @HttpCode(202)
  async ingestMeter(@Body() dto: MeterTelemetryDto): Promise<void> {
    await this.ingestionService.ingestMeter(dto);
  }

  @Post('vehicle')
  @HttpCode(202)
  async ingestVehicle(@Body() dto: VehicleTelemetryDto): Promise<void> {
    await this.ingestionService.ingestVehicle(dto);
  }
}
