import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterTelemetryHistory } from '../entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../entities/vehicle-telemetry-history.entity';
import { MeterLiveStatus } from '../entities/meter-live-status.entity';
import { VehicleLiveStatus } from '../entities/vehicle-live-status.entity';
import { MeterTelemetryDto } from './dto/meter-telemetry.dto';
import { VehicleTelemetryDto } from './dto/vehicle-telemetry.dto';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(MeterTelemetryHistory)
    private readonly meterHistoryRepo: Repository<MeterTelemetryHistory>,
    @InjectRepository(VehicleTelemetryHistory)
    private readonly vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,
    @InjectRepository(MeterLiveStatus)
    private readonly meterLiveRepo: Repository<MeterLiveStatus>,
    @InjectRepository(VehicleLiveStatus)
    private readonly vehicleLiveRepo: Repository<VehicleLiveStatus>,
  ) {}

  async ingestMeter(dto: MeterTelemetryDto): Promise<void> {
    const timestamp = new Date(dto.timestamp);
    await this.meterHistoryRepo.insert({
      meterId: dto.meterId,
      kwhConsumedAc: dto.kwhConsumedAc.toString(),
      voltage: dto.voltage.toString(),
      timestamp,
    });

    await this.meterLiveRepo.upsert(
      {
        meterId: dto.meterId,
        kwhConsumedAc: dto.kwhConsumedAc.toString(),
        voltage: dto.voltage.toString(),
        timestamp,
      },
      ['meterId'],
    );
  }

  async ingestVehicle(dto: VehicleTelemetryDto): Promise<void> {
    const timestamp = new Date(dto.timestamp);
    await this.vehicleHistoryRepo.insert({
      vehicleId: dto.vehicleId,
      soc: dto.soc.toString(),
      kwhDeliveredDc: dto.kwhDeliveredDc.toString(),
      batteryTemp: dto.batteryTemp.toString(),
      timestamp,
    });

    await this.vehicleLiveRepo.upsert(
      {
        vehicleId: dto.vehicleId,
        soc: dto.soc.toString(),
        kwhDeliveredDc: dto.kwhDeliveredDc.toString(),
        batteryTemp: dto.batteryTemp.toString(),
        timestamp,
      },
      ['vehicleId'],
    );
  }
}
