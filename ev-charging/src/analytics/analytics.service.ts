import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterTelemetryHistory } from '../entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../entities/vehicle-telemetry-history.entity';
import { VehicleMeterMapping } from '../entities/vehicle-meter-mapping.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehicleMeterMapping)
    private readonly mappingRepo: Repository<VehicleMeterMapping>,
    @InjectRepository(MeterTelemetryHistory)
    private readonly meterHistoryRepo: Repository<MeterTelemetryHistory>,
    @InjectRepository(VehicleTelemetryHistory)
    private readonly vehicleHistoryRepo: Repository<VehicleTelemetryHistory>,
  ) {}

  async getPerformance(vehicleId: string) {
    const mapping = await this.mappingRepo.findOne({
      where: { vehicleId },
    });

    if (!mapping) {
      throw new NotFoundException(`No meter mapping for vehicle ${vehicleId}`);
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const meterAgg = await this.meterHistoryRepo
      .createQueryBuilder('meter')
      .select('COALESCE(SUM(meter.kwh_consumed_ac), 0)', 'totalAc')
      .where('meter.meter_id = :meterId', { meterId: mapping.meterId })
      .andWhere('meter.timestamp >= :since', { since })
      .getRawOne<{ totalAc: string }>();

    const vehicleAgg = await this.vehicleHistoryRepo
      .createQueryBuilder('vehicle')
      .select('COALESCE(SUM(vehicle.kwh_delivered_dc), 0)', 'totalDc')
      .addSelect('COALESCE(AVG(vehicle.battery_temp), 0)', 'avgTemp')
      .where('vehicle.vehicle_id = :vehicleId', { vehicleId })
      .andWhere('vehicle.timestamp >= :since', { since })
      .getRawOne<{ totalDc: string; avgTemp: string }>();

    const totalAc = Number(meterAgg?.totalAc ?? 0);
    const totalDc = Number(vehicleAgg?.totalDc ?? 0);
    const avgTemp = Number(vehicleAgg?.avgTemp ?? 0);

    return {
      vehicleId,
      meterId: mapping.meterId,
      windowHours: 24,
      totalAcKwh: totalAc,
      totalDcKwh: totalDc,
      efficiencyRatio: totalAc > 0 ? totalDc / totalAc : 0,
      averageBatteryTemp: avgTemp,
    };
  }
}
