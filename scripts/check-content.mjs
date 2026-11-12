#!/usr/bin/env node
/**
 * Lists every content slot that is still empty, and whether a SAMPLE
 * stand-in is filling it.
 *
 *   pnpm check:content           report only
 *   pnpm check:launch            also fail (exit 1) if a required slot is
 *                                empty or any SAMPLE is in use: run before
 *                                setting launch.indexable to true
 *
 * Node 22 strips the types from content/profile.ts on import.
 */
import { content, SAMPLE, REQUIRED, launch } from "../content/profile.ts"

const strict = process.argv.includes("--strict")

const isEmpty = (value) => {
  if (value === undefined || value === null) return true
  if (typeof value === "string") return value.trim() === ""
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === "object") return Object.values(value).every(isEmpty)
  return false
}

const rows = Object.keys(content).map((key) => {
  const empty = isEmpty(content[key])
  const sampled = empty && launch.useSamples && !isEmpty(SAMPLE[key])
  const required = REQUIRED.includes(key)
  const size = Array.isArray(content[key]) && content[key].length ? ` (${content[key].length})` : ""
  return { key, empty, sampled, required, size }
})

const filled = rows.filter((row) => !row.empty)
const missing = rows.filter((row) => row.empty)

console.log(`\nContent check: ${filled.length} of ${rows.length} slots have her real material.\n`)
for (const row of rows) {
  const state = !row.empty ? "filled " : row.sampled ? "SAMPLE " : "empty  "
  const mark = row.required ? " required" : ""
  console.log(`  ${state} ${row.key}${row.size}${mark}`)
}

const blockers = missing.filter((row) => row.required)
console.log(
  `\nlaunch.useSamples = ${launch.useSamples}, launch.indexable = ${launch.indexable}` +
    (blockers.length ? `\nRequired before launch: ${blockers.map((row) => row.key).join(", ")}` : "\nAll required slots are filled."),
)

if (strict) {
  const sampledNow = rows.filter((row) => row.sampled)
  if (blockers.length || sampledNow.length) {
    console.error("\nNot ready to launch: fill the slots above, then set launch.useSamples to false.")
    process.exit(1)
  }
  console.log("\nReady to launch.")
}
console.log("")
