import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'vehicle_meter_mapping' })
export class VehicleMeterMapping {
  @PrimaryColumn({ name: 'vehicle_id', type: 'varchar', length: 64 })
  vehicleId!: string;

  @Index()
  @Column({ name: 'meter_id', type: 'varchar', length: 64 })
  meterId!: string;
}
