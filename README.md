# Delivery_Handoff_Simulation

## Overview
This service models long-distance deliveries where multiple riders may sequentially handle the same order.

## Assumptions
- Only one rider can work on an order at a time
- Orders may receive duplicate or out-of-order requests
- No authentication or routing logic is included

## Design Decisions
- Used a state machine (`CREATED`, `IN_PROGRESS`, `COMPLETED`)
- Separated current order state from historical rider assignments
- Used database transactions and row-level locking to ensure correctness

## Concurrency Handling
- All state changes occur inside transactions
- Order rows are locked using pessimistic locking
- Conflicting rider actions are rejected deterministically

## Idempotency
- Duplicate `start` or `finish` requests return consistent results
- Out-of-order requests are safely ignored or rejected

## Running the Project
```bash
npm install
npm run start:dev


