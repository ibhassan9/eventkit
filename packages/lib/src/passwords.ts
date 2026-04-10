import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const WORDS = [
  "maple",  "river",  "ocean",  "spark",  "cedar",  "frost",  "coral",
  "blaze",  "drift",  "grove",  "lunar",  "pearl",  "stone",  "swift",
  "ember",  "haven",  "ridge",  "delta",  "flint",  "aspen",  "birch",
  "cloud",  "dune",   "fern",   "gale",   "iris",   "jade",   "lark",
  "mint",   "nest",   "opal",   "pine",   "quay",   "reed",   "sage",
  "tide",   "vale",   "wren",   "amber",  "brook",  "crest",  "dusk",
];

export function generateTemporaryPassword(): string {
  const w1 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const w2 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${w1}-${w2}-${num}`;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const keyBuffer = Buffer.from(key, "hex");
  return timingSafeEqual(derived, keyBuffer);
}
