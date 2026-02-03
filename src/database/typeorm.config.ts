import { DataSourceOptions } from 'typeorm';
import { MeterTelemetryHistory } from '../entities/meter-telemetry-history.entity';
import { VehicleTelemetryHistory } from '../entities/vehicle-telemetry-history.entity';
import { MeterLiveStatus } from '../entities/meter-live-status.entity';
import { VehicleLiveStatus } from '../entities/vehicle-live-status.entity';
import { VehicleMeterMapping } from '../entities/vehicle-meter-mapping.entity';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'telemetry',
  entities: [
    MeterTelemetryHistory,
    VehicleTelemetryHistory,
    MeterLiveStatus,
    VehicleLiveStatus,
    VehicleMeterMapping,
  ],
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
};
