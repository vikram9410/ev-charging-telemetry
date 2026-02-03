import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'meter_telemetry_history' })
@Index(['meterId', 'timestamp'])
export class MeterTelemetryHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'meter_id', type: 'varchar', length: 64 })
  meterId!: string;

  @Column({ name: 'kwh_consumed_ac', type: 'numeric', precision: 12, scale: 4 })
  kwhConsumedAc!: string;

  @Column({ name: 'voltage', type: 'numeric', precision: 10, scale: 2 })
  voltage!: string;

  @Column({ type: 'timestamptz' })
  timestamp!: Date;
}
