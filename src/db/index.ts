import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://user:pass@ep-demo.us-east-1.aws.neon.tech/topupgame?sslmode=require";

// Use Pool for transaction support and persistent connections
let pool: Pool | null = null;

export function getDb() {
  if (!pool) {
    pool = new Pool({ connectionString });
    // Catch connection errors on idle pool clients gracefully to prevent crashing
    pool.on("error", (err) => {
      // Non-fatal background pool error handled
    });
  }
  return drizzle(pool, { schema });
}

export const db = getDb();
export { schema };
