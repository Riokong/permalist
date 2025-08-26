# Permalist
## Quick Start

```bash
# 1) Install deps
npm install

# 2) Create and fill env vars
cp .env.example .env
# then edit .env with your DB credentials

# 3) Create DB (once)
createdb permalist || true

# 4) Create table (minimal schema)
psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -c \
"CREATE TABLE IF NOT EXISTS items (
  id    SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL
);"

# Optional seed data
psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -c \
"INSERT INTO items (title) VALUES ('Buy milk'), ('Finish homework');"

# 5) Run
npm start
