# Card Inventory Database Migration Roadmap

The current card inventory uses `data/cards.json` behind a small server-side query layer. This is suitable for local development, but a SQL database should replace it before the inventory reaches production scale or approximately 50,000 records.

## Target schema

Use PostgreSQL (or a compatible SQL database) with one `cards` table:

```sql
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    bin VARCHAR(32) NOT NULL,
    bin_digits VARCHAR(12) NOT NULL,
    bank VARCHAR(120) NOT NULL,
    card_class VARCHAR(20) NOT NULL,
    level VARCHAR(30) NOT NULL,
    expiry VARCHAR(12) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL,
    state VARCHAR(80) NOT NULL,
    city VARCHAR(80) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    database_tag VARCHAR(100) NOT NULL,
    ssn VARCHAR(3) NOT NULL,
    dob VARCHAR(3) NOT NULL,
    vendor VARCHAR(120) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Indexes

Add indexes that match the dashboard filters and default ordering. Use composite or partial indexes only after measuring real query plans.

```sql
CREATE INDEX cards_created_id_idx ON cards (created_at DESC, id DESC);
CREATE INDEX cards_bin_digits_idx ON cards (bin_digits text_pattern_ops);
CREATE INDEX cards_country_code_idx ON cards (country_code);
CREATE INDEX cards_bank_idx ON cards (bank);
CREATE INDEX cards_state_idx ON cards (state);
CREATE INDEX cards_city_idx ON cards (city);
CREATE INDEX cards_price_idx ON cards (price);
```

For case-insensitive exact filters, either normalize values at write time or use PostgreSQL `citext`. For substring search on bank, city, or vendor, evaluate `pg_trgm` and a GIN index instead of relying on a leading-wildcard B-tree scan.

## Query contract

Keep the existing API contract so the dashboard does not need a storage-specific change. Validate `page`, `perPage`, sort field, sort direction, and filter values at the API boundary. The SQL query should use a bound parameter for every user value:

```sql
SELECT *
FROM cards
WHERE country_code = $1
ORDER BY price DESC, id DESC
LIMIT $2 OFFSET $3;
```

Run a separate `COUNT(*)` query for the filtered total, or return an approximate count only when product requirements allow it. Never interpolate filter or sort input directly into SQL; map approved sort keys to fixed column names.

## Migration steps

1. Add a migration tool and environment-based PostgreSQL connection settings.
2. Create the `cards` table and indexes in a versioned migration.
3. Write an idempotent importer that reads `data/cards.json`, validates/sanitizes each record with the existing rules, and inserts in batches using `ON CONFLICT (id) DO UPDATE`.
4. Compare JSON and SQL counts, IDs, and representative filter/sort results before switching reads.
5. Introduce a repository interface with JSON and PostgreSQL implementations, then run the dashboard against PostgreSQL in staging.
6. Switch admin writes and dashboard reads together, retain a read-only JSON backup for rollback, and remove JSON writes after the observation window.
7. Load-test 50,000+ records with the real filter combinations and inspect `EXPLAIN (ANALYZE, BUFFERS)` before finalizing indexes.

## Operational requirements

Use connection pooling, transactions for bulk inserts, periodic backups, structured query timing, and an index-maintenance plan. Cursor/keyset pagination should be considered later for very deep pages; `LIMIT/OFFSET` remains compatible with the current API and is adequate for the initial migration.
