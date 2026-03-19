import pool from "./client";

const seed = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query(`BEGIN`);

    await client.query(`
          INSERT INTO categories (name, description) VALUES
            ('Electronics', 'Electronic devices and accessories'),
            ('Clothing', 'Apparel and fashion items'),
            ('Food & Beverages', 'Edible products and drinks')
          ON CONFLICT (name) DO NOTHING;
        `);

    await client.query(`
          INSERT INTO products (name, description, quantity, price, category_id) VALUES
            ('Wireless Mouse', 'Ergonomic bluetooth mouse', 50, 799.99, 1),
            ('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 3, 2499.99, 1),
            ('USB-C Hub', '7-in-1 USB-C hub', 0, 1299.99, 1),
            ('Cotton T-Shirt', '100% cotton round neck tshirt', 8, 299.99, 2),
            ('Running Shoes', 'Lightweight running shoes', 2, 1999.99, 2),
            ('Green Tea', 'Organic green tea 100 bags', 100, 199.99, 3),
            ('Protein Bar', 'Chocolate flavour protein bar', 4, 99.99, 3)
          ON CONFLICT DO NOTHING;
        `);

    await client.query("COMMIT");
    console.log("Seed Successful");
  } catch (err) {
    await client.query("ROLLBACK");
    console.log("Seed failed, rolled back:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
