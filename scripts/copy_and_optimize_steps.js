import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/welington/.gemini/antigravity-ide/brain/95ee2c22-6827-47cc-9448-dac2f816fdc9';
const targetDir = path.resolve('./public/code_files');

const mapping = [
  { match: 'step_1_prepare_base', out: 'step1.webp' },
  { match: 'step_2_distribute_cheeses', out: 'step2.webp' },
  { match: 'step_3_add_cold_cuts', out: 'step3.webp' },
  { match: 'step_4_include_fruits', out: 'step4.webp' },
  { match: 'step_5_add_nuts_crackers', out: 'step5.webp' },
  { match: 'step_6_decorate_and_serve', out: 'step6.webp' }
];

async function processSteps() {
  const files = fs.readdirSync(artifactDir);

  for (const item of mapping) {
    const foundFile = files.find(f => f.startsWith(item.match) && f.endsWith('.png'));
    if (foundFile) {
      const srcPath = path.join(artifactDir, foundFile);
      const destPath = path.join(targetDir, item.out);

      await sharp(srcPath)
        .resize({ width: 450, fit: 'inside' })
        .webp({ quality: 75 })
        .toFile(destPath);

      console.log(`Converted ${foundFile} -> ${item.out}`);
    }
  }
}

processSteps();
