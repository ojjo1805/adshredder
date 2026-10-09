/**
 * Pure-Node PNG icon generator for AdShredder
 * Generates Cyber-Emerald / Electric Teal icons (16x16, 48x48, 128x128)
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, drawPixel) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8-bit depth
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10);
  ihdr.writeUInt8(0, 11);
  ihdr.writeUInt8(0, 12);
  const ihdrChunk = createChunk('IHDR', ihdr);

  const rawData = Buffer.alloc(height * (width * 4 + 1));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0;
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Drawing logic: Premium Electric Teal / Emerald Shield with Neon Bolt
function drawShield(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w * 0.42);
  const dy = (y - cy) / (h * 0.45);
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist <= 1.0) {
    // Shield background: Deep Teal / Emerald gradient
    const gradient = Math.max(0, Math.min(1, y / h));
    const rCol = Math.round(6 * (1 - gradient * 0.5));
    const gCol = Math.round(182 * (1 - gradient * 0.3));
    const bCol = Math.round(212 * (1 - gradient * 0.2));

    // Inner lightning / blade
    const normX = x / w;
    const normY = y / h;
    const isLightning = (
      (normX > 0.42 && normX < 0.62 && normY > 0.22 && normY < 0.52) ||
      (normX > 0.35 && normX < 0.55 && normY > 0.48 && normY < 0.78)
    );

    if (isLightning) {
      return [255, 255, 255, 255]; // Pure White core
    }

    // Outer Neon Glow border
    if (dist > 0.86) {
      return [34, 211, 238, 255]; // Bright Cyan border
    }

    return [rCol, gCol, bCol, 255];
  }

  return [0, 0, 0, 0];
}

const iconsDir = path.resolve(__dirname, 'src/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach((size) => {
  const png = createPng(size, size, drawShield);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Generated Electric Teal icon${size}.png`);
});
