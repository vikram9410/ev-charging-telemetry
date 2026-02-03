import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class VehicleTelemetryDto {
  @IsString()
  vehicleId!: string;

  @Type(() => Number)
  @IsNumber()
  soc!: number;

  @Type(() => Number)
  @IsNumber()
  kwhDeliveredDc!: number;

  @Type(() => Number)
  @IsNumber()
  batteryTemp!: number;

  @IsDateString()
  timestamp!: string;
}
