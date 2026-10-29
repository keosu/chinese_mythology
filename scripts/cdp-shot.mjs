// Decodes a saved CDP Page.captureScreenshot response into an image file.
import fs from 'node:fs';
const [, , input, output = 'shot.jpg'] = process.argv;
const json = JSON.parse(fs.readFileSync(input, 'utf8'));
const data = json.data ?? json.result?.data;
fs.writeFileSync(output, Buffer.from(data, 'base64'));
console.log('wrote', output);
