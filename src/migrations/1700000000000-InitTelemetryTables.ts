import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTelemetryTables1700000000000 implements MigrationInterface {
  name = 'InitTelemetryTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS meter_telemetry_history (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        meter_id varchar(64) NOT NULL,
        kwh_consumed_ac numeric(12,4) NOT NULL,
        voltage numeric(10,2) NOT NULL,
        timestamp timestamptz NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_meter_telemetry_device_time
      ON meter_telemetry_history (meter_id, timestamp);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vehicle_telemetry_history (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        vehicle_id varchar(64) NOT NULL,
        soc numeric(5,2) NOT NULL,
        kwh_delivered_dc numeric(12,4) NOT NULL,
        battery_temp numeric(6,2) NOT NULL,
        timestamp timestamptz NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicle_telemetry_device_time
      ON vehicle_telemetry_history (vehicle_id, timestamp);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS meter_live_status (
        meter_id varchar(64) PRIMARY KEY,
        kwh_consumed_ac numeric(12,4) NOT NULL,
        voltage numeric(10,2) NOT NULL,
        timestamp timestamptz NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vehicle_live_status (
        vehicle_id varchar(64) PRIMARY KEY,
        soc numeric(5,2) NOT NULL,
        kwh_delivered_dc numeric(12,4) NOT NULL,
        battery_temp numeric(6,2) NOT NULL,
        timestamp timestamptz NOT NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS vehicle_meter_mapping (
        vehicle_id varchar(64) PRIMARY KEY,
        meter_id varchar(64) NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicle_meter_mapping_meter
      ON vehicle_meter_mapping (meter_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS vehicle_meter_mapping;`);
    await queryRunner.query(`DROP TABLE IF EXISTS vehicle_live_status;`);
    await queryRunner.query(`DROP TABLE IF EXISTS meter_live_status;`);
    await queryRunner.query(`DROP TABLE IF EXISTS vehicle_telemetry_history;`);
    await queryRunner.query(`DROP TABLE IF EXISTS meter_telemetry_history;`);
  }
}
