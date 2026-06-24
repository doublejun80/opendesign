#!/usr/bin/env node

import { createEditorServer, resolveReportDir } from './report-editor-core.mjs';

function readArg(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index < 0) return fallback;
  return process.argv[index + 1] || fallback;
}

const positional = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const rootDir = process.cwd();
const reportDir = resolveReportDir(positional || 'reports/sample-executive-report', { rootDir });
const host = readArg('--host', '127.0.0.1');
const port = Number(readArg('--port', process.env.PORT || '4173'));

const server = await createEditorServer({
  rootDir,
  reportDir,
  host,
  port
});

console.log(`Open Design Report Editor`);
console.log(`Report: ${server.reportDir}`);
console.log(`URL: ${server.url}`);
console.log(`Press Ctrl+C to stop.`);

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.close();
  process.exit(0);
});
