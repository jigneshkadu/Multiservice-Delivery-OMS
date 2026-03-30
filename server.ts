
import express from 'express';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Database Configuration
  const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    port: parseInt(process.env.MYSQLPORT || '3306'),
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'dahanu_db',
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  };

  let pool: mysql.Pool | null = null;

  const initDb = async () => {
    try {
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      console.log("Connected to Database successfully.");
      connection.release();

      // Core Tables
      await pool.query(`CREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(255), phone VARCHAR(20), role ENUM('USER', 'VENDOR', 'ADMIN', 'RIDER') DEFAULT 'USER', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      await pool.query(`CREATE TABLE IF NOT EXISTS categories (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100) NOT NULL, icon VARCHAR(50), description TEXT, parent_id VARCHAR(50), theme_color VARCHAR(20) DEFAULT '#2874f0', registration_fee DECIMAL(10,2) DEFAULT 999.00, FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL)`);
      await pool.query(`CREATE TABLE IF NOT EXISTS vendors (id VARCHAR(50) PRIMARY KEY, user_id VARCHAR(50), name VARCHAR(100) NOT NULL, description TEXT, rating DECIMAL(3,1) DEFAULT 4.0, lat DECIMAL(10,8), lng DECIMAL(11,8), address TEXT, contact VARCHAR(50), is_verified BOOLEAN DEFAULT FALSE, is_approved BOOLEAN DEFAULT FALSE, image_url TEXT, supports_delivery BOOLEAN DEFAULT FALSE, price_start DECIMAL(10,2) DEFAULT 0.00, email VARCHAR(100), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL)`);
      await pool.query(`CREATE TABLE IF NOT EXISTS riders (id VARCHAR(50) PRIMARY KEY, user_id VARCHAR(50), name VARCHAR(100) NOT NULL, phone VARCHAR(20) NOT NULL, vehicle_type ENUM('BIKE', 'SCOOTER', 'CYCLE') NOT NULL, status ENUM('ONLINE', 'OFFLINE', 'BUSY') DEFAULT 'OFFLINE', lat DECIMAL(10,8), lng DECIMAL(11,8), is_approved BOOLEAN DEFAULT FALSE, rating DECIMAL(3,1) DEFAULT 5.0, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL)`);
      
      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(50) PRIMARY KEY, 
          vendor_id VARCHAR(50), 
          rider_id VARCHAR(50),
          customer_name VARCHAR(100), 
          customer_phone VARCHAR(20), 
          date DATETIME DEFAULT CURRENT_TIMESTAMP, 
          status ENUM('PENDING', 'ACCEPTED', 'PREPARING', 'OUT_FOR_DELIVERY', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING', 
          address TEXT, 
          total_amount DECIMAL(10,2), 
          payment_status ENUM('PAID', 'UNPAID') DEFAULT 'UNPAID', 
          service_requested TEXT,
          FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
          FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE SET NULL
        )
      `);

      console.log("Database initialized.");
    } catch (err) {
      console.warn("Database connection failed. App will use mock data. Error:", err.message);
      // Don't crash the server, just log the warning.
    }
  };

  await initDb();

  // --- API Endpoints ---
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', dbConnected: !!pool });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', dbConnected: !!pool });
  });

  app.get('/api/orders', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    try {
      const [rows] = await pool.query(`
        SELECT o.*, v.name as vendor_name, r.name as rider_name, r.phone as rider_phone 
        FROM orders o 
        LEFT JOIN vendors v ON o.vendor_id = v.id 
        LEFT JOIN riders r ON o.rider_id = r.id
        ORDER BY o.date DESC
      `);
      res.json(rows);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.patch('/api/orders/:id/assign', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    const { id } = req.params;
    const { riderId } = req.body;
    try {
      await pool.query("UPDATE orders SET rider_id = ?, status = 'ACCEPTED' WHERE id = ?", [riderId, id]);
      res.json({ success: true });
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/categories', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    try {
      const [rows]: any = await pool.query("SELECT * FROM categories");
      const buildTree = (parentId: string | null) => rows.filter((r: any) => r.parent_id === parentId).map((r: any) => ({ ...r, subCategories: buildTree(r.id) }));
      res.json(buildTree(null));
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/vendors', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    try {
      const [vendors] = await pool.query("SELECT * FROM vendors WHERE is_approved = TRUE");
      res.json(vendors);
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/riders', async (req, res) => {
    if (!pool) return res.status(503).json({ error: 'Database not connected' });
    try {
      const [riders]: any = await pool.query("SELECT * FROM riders");
      res.json(riders.map((r: any) => ({ ...r, location: { lat: parseFloat(r.lat), lng: parseFloat(r.lng) } })));
    } catch (err: any) { res.status(500).json({ error: err.message }); }
  });

  // Vite middleware for development
  const distPath = path.join(process.cwd(), 'dist');
  const distExists = fs.existsSync(distPath);
  
  if (process.env.NODE_ENV !== 'production' || !distExists) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
