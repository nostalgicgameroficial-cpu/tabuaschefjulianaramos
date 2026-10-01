import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = path.resolve('./public/code_files');

async function optimize() {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) continue;

    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

    const baseName = path.basename(file, ext);
    const outWebpName = `${baseName}.webp`;
    const outWebpPath = path.join(dir, outWebpName);

    try {
      let pipeline = sharp(filePath);
      const metadata = await pipeline.metadata();

      let maxWidth = 600;
      if (file.includes('hero_imagem') || file.includes('hero imagem')) maxWidth = 600;
      else if (file.includes('chatgpt_testimonial') || file.includes('ChatGPT')) maxWidth = 480;
      else if (file.includes('mokup 90 natal') || file.includes('content_mockup')) maxWidth = 550;
      else if (file.includes('JkRnpY1')) maxWidth = 250;
      else if (file.includes('bonus_ano_novo')) maxWidth = 400;
      else if (file.includes('unnamed') || file.includes('galeria') || file.includes('review')) maxWidth = 400;

      if (metadata.width && metadata.width > maxWidth) {
        pipeline = pipeline.resize({ width: maxWidth, fit: 'inside', withoutEnlargement: true });
      }

      await pipeline
        .webp({ quality: 72, effort: 6 })
        .toFile(outWebpPath);

      const newStat = fs.statSync(outWebpPath);
      console.log(` -> WebP optimized: ${outWebpName} (${(newStat.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

optimize();
