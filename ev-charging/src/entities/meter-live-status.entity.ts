import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'meter_live_status' })
export class MeterLiveStatus {
  @PrimaryColumn({ name: 'meter_id', type: 'varchar', length: 64 })
  meterId!: string;

  @Column({ name: 'kwh_consumed_ac', type: 'numeric', precision: 12, scale: 4 })
  kwhConsumedAc!: string;

  @Column({ name: 'voltage', type: 'numeric', precision: 10, scale: 2 })
  voltage!: string;

  @Column({ name: 'timestamp', type: 'timestamptz' })
  timestamp!: Date;
}
