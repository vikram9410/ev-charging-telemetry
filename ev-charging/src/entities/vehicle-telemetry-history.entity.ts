import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'vehicle_telemetry_history' })
@Index(['vehicleId', 'timestamp'])
export class VehicleTelemetryHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'vehicle_id', type: 'varchar', length: 64 })
  vehicleId!: string;

  @Column({ name: 'soc', type: 'numeric', precision: 5, scale: 2 })
  soc!: string;

  @Column({ name: 'kwh_delivered_dc', type: 'numeric', precision: 12, scale: 4 })
  kwhDeliveredDc!: string;

  @Column({ name: 'battery_temp', type: 'numeric', precision: 6, scale: 2 })
  batteryTemp!: string;

  @Column({ type: 'timestamptz' })
  timestamp!: Date;
}
