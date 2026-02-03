EV Charging Telemetry Backend

This service ingests high‑volume smart‑meter and vehicle telemetry and exposes 24‑hour performance analytics. It is designed to sustain ~14.4 million records per day with predictable query latencies.

Data Correlation Strategy

Vehicle and meter telemetry arrive separately. Correlation is done via a static mapping table so the system can aggregate AC energy (from meters) with DC energy and battery stats (from vehicles).

Tables:
- `vehicle_meter_mapping(vehicle_id, meter_id)`
- `meter_telemetry_history(meter_id, timestamp, ...)`
- `vehicle_telemetry_history(vehicle_id, timestamp, ...)`

The analytics flow:
1. Resolve `meter_id` from `vehicle_id`.
2. Aggregate AC totals from `meter_telemetry_history` for the last 24 hours.
3. Aggregate DC totals and averages from `vehicle_telemetry_history` for the last 24 hours.

This approach avoids cross‑joining large history tables and keeps the query bounded by a time window.

The architecture handles this scale via:

# 1) Append‑only cold store
- History tables are INSERT‑only, optimized for high write throughput.
- Composite indexes `(device_id, timestamp)` support time‑bounded lookups.

# 2) Constant‑time hot store
- Live tables hold one row per device and are updated with UPSERT.
- Dashboard or status‑style queries remain O(1) by device key.

# 3) Time‑bounded analytics
- The `/v1/analytics/performance/:vehicleId` endpoint queries only the last 24 hours using indexed timestamps, avoiding full table scans.

# 4) Horizontal scaling ready
- Ingestion is stateless; API pods can scale behind a load balancer.
- Postgres can scale vertically or via read replicas for analytics workloads.

# Future Enhancements

- AWS Kinesis ingestion: AWS Kinesis is a solid fit for collecting telemetry from devices via Kinesis Data Streams we can explore it as well.
- Queue + batch writes: enqueue validated telemetry and flush in batches to improve write throughput.
- Retention + archiving pipeline: move older history to cheaper storage (S3) and keep only hot data in Postgres for fast analytics.

# API Summary

- `POST /v1/ingestion/meter`
- `POST /v1/ingestion/vehicle`
- `GET /v1/analytics/performance/:vehicleId`

# Local Run

```bash
docker-compose up --build
```

The API is available at `http://localhost:3000/v1`.
