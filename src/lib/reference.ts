import { randomInt } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeReference(): string {
  let suffix = "";
  for (let index = 0; index < 4; index += 1) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `GA-${suffix}`;
}
