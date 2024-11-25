import { Request, Response } from "express";
import { Client, QueryResultRow } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Database connection
const pool = new Client({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
});

pool.connect().catch((err) => {
  console.error("Failed to connect to PostgreSQL:", err.message);
  process.exit(1);
});

console.log("Postgres Config:", {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: "Not displayed for security"  
});


// Define types
interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  salt: string;
}

// Utility function to execute queries
const executeQuery = async <T extends QueryResultRow>(
  query: string,
  params: unknown[],
): Promise<T[]> => {
  const result = await pool.query<T>(query, params);
  return result.rows;
};

// Register user function
export const registerUser = async (
  username: string,
  password: string,
): Promise<void> => {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const query =
    "INSERT INTO users (username, password_hash) VALUES ($1, $2)";
  await executeQuery(query, [username, hashedPassword]);
};

// Login handler function
export const loginHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, password } = req.body;

  try {
    const query = "SELECT * FROM users WHERE username = $1";
    const rows = await executeQuery<UserRow>(query, [username]);

    if (!rows || rows.length === 0) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (isMatch) {
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "24h",
        },
      );
      res.status(200).json({ success: true, token, username: user.username });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in loginHandler:", (error as Error).message);
    res.status(500).json({ success: false, message: "Database error" });
  }
};

// Export reusable utilities
export { pool, executeQuery };
