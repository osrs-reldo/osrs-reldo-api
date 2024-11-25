import dotenv from "dotenv";

// Dynamically select the correct .env file
const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.development";
dotenv.config({ path: envFile });

console.log(`Environment loaded from: ${envFile}`);
