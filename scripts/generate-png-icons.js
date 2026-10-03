import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal PNG generator without external dependencies
function createPng(width, height, drawFn) {
  // RGBA buffer with filter byte per scanline
  const scanlineLength = width * 4 + 1;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR Chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA (6)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const typeBuffer = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuffer, data]);
  const crc = crc32(body);

  const chunk = Buffer.alloc(4 + 4 + length + 4);
  chunk.writeUInt32BE(length, 0);
  body.copy(chunk, 4);
  chunk.writeInt32BE(crc, 4 + 4 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
}

// Drawing function for VoltCraft Lab Icon
function drawVoltCraft(x, y, width, height, isMaskable = false) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = width * (isMaskable ? 0.38 : 0.44);

  // Background: Dark Slate #020617
  let r = 2, g = 6, b = 23, a = 255;

  // Outer gold accent ring
  if (dist >= radius - 4 && dist <= radius + 2) {
    r = 245; g = 158; b = 11; a = 255; // Amber 500
    return [r, g, b, a];
  }

  // Inner shield circle
  if (dist < radius) {
    // Gradient dark navy-slate inside shield
    r = 15; g = 23; b = 42; a = 255; // Slate 900
    
    // Lightning bolt in center
    // Normalized coordinates (-1 to 1)
    const nx = (x - cx) / (width * 0.32);
    const ny = (y - cy) / (height * 0.32);

    // Polygon coordinates for classic high-voltage bolt:
    // P1: (0.1, -0.85), P2: (-0.35, 0.05), P3: (0.0, 0.05)
    // P4: (-0.1, 0.85), P5: (0.35, -0.05), P6: (0.0, -0.05)
    const inUpper = (ny >= -0.85 && ny <= 0.05) && (nx >= -0.4 && nx <= 0.2) && (nx + 0.5 * ny >= -0.2) && (nx + 0.4 * ny <= 0.35);
    const inLower = (ny >= -0.05 && ny <= 0.85) && (nx >= -0.2 && nx <= 0.4) && (nx + 0.5 * ny >= -0.05) && (nx + 0.4 * ny <= 0.5);

    if (inUpper || inLower) {
      // Golden Bolt
      r = 251; g = 191; b = 36; a = 255; // Amber 400
    }
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. 192x192 PNG
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, (x, y, w, h) => drawVoltCraft(x, y, w, h, false)));
// 2. 512x512 PNG
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, (x, y, w, h) => drawVoltCraft(x, y, w, h, false)));
// 3. Maskable 512x512 PNG (padded for Android squircles)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, (x, y, w, h) => drawVoltCraft(x, y, w, h, true)));
// 4. Apple Touch Icon 180x180 PNG
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, (x, y, w, h) => drawVoltCraft(x, y, w, h, false)));

console.log('Successfully generated PWA PNG icons in /public:');
console.log(' - pwa-192x192.png');
console.log(' - pwa-512x512.png');
console.log(' - pwa-maskable-512x512.png');
console.log(' - apple-touch-icon.png');
