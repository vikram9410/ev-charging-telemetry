import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class MeterTelemetryDto {
  @IsString()
  meterId!: string;

  @Type(() => Number)
  @IsNumber()
  kwhConsumedAc!: number;

  @Type(() => Number)
  @IsNumber()
  voltage!: number;

  @IsDateString()
  timestamp!: string;
}
