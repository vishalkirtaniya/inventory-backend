# Inventory Management REST API

A REST API to manage a product inventory system built with Node.js, Express, TypeScript, and PostgreSQL.

---

## Tech Stack

- Node.js + Express
- TypeScript
- PostgreSQL
- Zod (input validation)

---

## Prerequisites

Make sure you have these installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/inventory-api.git
cd inventory-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up PostgreSQL

Start PostgreSQL and open the psql shell:

```bash
sudo systemctl start postgresql
sudo -u postgres psql
```

Create the database and user:

```sql
CREATE USER inventory_user WITH PASSWORD 'yourpassword';
CREATE DATABASE inventory_db OWNER inventory_user;
\q
```

Update PostgreSQL to allow password authentication. Open `pg_hba.conf`:

```bash
sudo nano /var/lib/pgsql/data/pg_hba.conf
```

Make sure these lines use `md5`:

```
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

### 4. Create the `.env` file

Create a `.env` file in the project root:

```env
PORT=3500
DB_HOST=localhost
DB_PORT=5432
DB_USER=inventory_user
DB_PASSWORD=yourpassword
DB_NAME=inventory_db
```

### 5. Run the migration

This creates the `categories` and `products` tables:

```bash
npm run migrate
```

You should see: `Migration Successful`

### 6. Run the seed script

This populates the database with sample data:

```bash
npm run seed
```

You should see: `Seed Successful`

### 7. Start the development server

```bash
npm run dev
```

You should see: `Server running on port 3500`

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products with category name |
| POST | `/products` | Create a new product |
| PATCH | `/products/:id` | Update stock quantity |
| DELETE | `/products/:id` | Soft delete a product |
| GET | `/products/low-stock` | List products below stock threshold |

---

### GET /products

Returns all active products with their category name.

```bash
curl http://localhost:3500/products
```

---

### GET /products/low-stock

Returns products where quantity is below the threshold (default: 5).

```bash
curl http://localhost:3500/products/low-stock
# or with custom threshold
curl http://localhost:3500/products/low-stock?threshold=10
```

---

### POST /products

Creates a new product.

```bash
curl -X POST http://localhost:3500/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic bluetooth mouse",
    "quantity": 50,
    "price": 799.99,
    "category_id": 1
  }'
```

**Required fields:** `name`, `quantity`, `price`, `category_id`
**Optional fields:** `description`

---

### PATCH /products/:id

Updates the stock quantity of a product.

```bash
curl -X PATCH http://localhost:3500/products/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 99}'
```

---

### DELETE /products/:id

Soft deletes a product by setting `deleted_at` timestamp.

```bash
curl -X DELETE http://localhost:3500/products/1
```

---


## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | nodemon + ts-node | Start dev server with hot reload |
| `npm run build` | tsc | Compile TypeScript to JavaScript |
| `npm start` | node dist/index.js | Run compiled production build |
| `npm run migrate` | ts-node src/db/migrate.ts | Create database tables |
| `npm run seed` | ts-node src/db/seed.ts | Populate sample data |