import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
const match = env.match(/DATABASE_URL="mysql:\/\/([^:]+):([^@]+)@127\.0\.0\.1:(\d+)\/([^?"]+)/);
if (!match) {
  console.error("DATABASE_URL missing");
  process.exit(1);
}

const [, user, password, port, database] = match;
const sql = `
CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${user}'@'127.0.0.1' IDENTIFIED BY '${password}';
ALTER USER '${user}'@'127.0.0.1' IDENTIFIED BY '${password}';
GRANT ALL PRIVILEGES ON \`${database}\`.* TO '${user}'@'127.0.0.1';
FLUSH PRIVILEGES;
`;

const result = spawnSync(
  "D:\\tools\\mariadb-11.4.8-winx64\\bin\\mysql.exe",
  ["--protocol=tcp", "-h", "127.0.0.1", "-P", port, "-u", "root"],
  { input: sql, encoding: "utf8" },
);

if (result.status !== 0) {
  console.error(result.stderr || result.stdout || "mysql failed");
  process.exit(result.status ?? 1);
}

console.log("DATABASE_READY");
