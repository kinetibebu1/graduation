import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const jiti = require("jiti")(path.join(rootDir, "index.js"), {
  alias: { "@": rootDir },
});

// Run test files
jiti(path.join(__dirname, "habits.test.ts"));
