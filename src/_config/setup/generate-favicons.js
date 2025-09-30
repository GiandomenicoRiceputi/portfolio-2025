import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {sharpsToIco} from 'sharp-ico';
import {pathToSvgLogo} from '../../_data/meta.js';

export async function createFavicons() {
  const outputDir = 'src/assets/images/favicon';
  fs.mkdirSync(outputDir, {recursive: true});

  // Get the SVG logo
  const svgBuffer = fs.readFileSync(pathToSvgLogo);

  // SVG icon
  fs.writeFileSync(`${outputDir}/favicon.svg`, svgBuffer);

  // PNG icons
  await sharp(svgBuffer).resize(16, 16).toFile(`${outputDir}/favicon-16x16.png`);
  await sharp(svgBuffer).resize(32, 32).toFile(`${outputDir}/favicon-32x32.png`);
  await sharp(svgBuffer).resize(180, 180).toFile(`${outputDir}/apple-touch-icon.png`);
  await sharp(svgBuffer).resize(192, 192).toFile(`${outputDir}/icon-192x192.png`);
  await sharp(svgBuffer).resize(512, 512).toFile(`${outputDir}/icon-512x512.png`);

  // maskable icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .extend({
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
      background: {r: 0, g: 0, b: 0, alpha: 0} // Transparent padding
    })
    .toFile(`${outputDir}/maskable-icon.png`);

  // ICO icon
  const iconSharp = sharp(svgBuffer);
  await sharpsToIco([iconSharp], `${outputDir}/favicon.ico`, {sizes: [32]});

  console.log('All favicons generated.');
}

const isCliInvocation = process.argv[1] === fileURLToPath(import.meta.url);

if (isCliInvocation) {
  createFavicons();
}
