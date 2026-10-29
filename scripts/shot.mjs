// Headless Edge screenshot: node scripts/shot.mjs <hashPath> <out> [width] [height]
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const [, , route = '/', out = '.shots/shot.png', w = '1440', h = '900'] = process.argv;
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const url = `http://127.0.0.1:5173/#${route}`;
execFileSync(edge, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--window-size=${w},${h}`,
  '--virtual-time-budget=7000',
  `--user-data-dir=${path.resolve('.shots/profile')}`,
  `--screenshot=${path.resolve(out)}`,
  url,
], { stdio: 'ignore', timeout: 60000 });
console.log('saved', out);
