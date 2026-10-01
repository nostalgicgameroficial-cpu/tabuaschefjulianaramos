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
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;

    const baseName = path.basename(file, ext);
    const outWebpName = `${baseName}.webp`;
    const outWebpPath = path.join(dir, outWebpName);

    console.log(`Processing: ${file} (${(stat.size / 1024).toFixed(1)} KB)`);

    try {
      let pipeline = sharp(filePath);
      const metadata = await pipeline.metadata();

      let maxWidth = 800;
      if (file.includes('hero_imagem') || file.includes('hero imagem')) maxWidth = 750;
      else if (file.includes('chatgpt_testimonial') || file.includes('ChatGPT')) maxWidth = 600;
      else if (file.includes('mokup 90 natal') || file.includes('content_mockup')) maxWidth = 700;
      else if (file.includes('JkRnpY1')) maxWidth = 300;
      else if (file.includes('bonus_ano_novo')) maxWidth = 500;
      else if (file.includes('unnamed') || file.includes('galeria') || file.includes('review')) maxWidth = 500;

      if (metadata.width && metadata.width > maxWidth) {
        pipeline = pipeline.resize({ width: maxWidth, fit: 'inside', withoutEnlargement: true });
      }

      const tempOut = path.join(dir, `_temp_${outWebpName}`);
      await pipeline
        .webp({ quality: 80, effort: 6 })
        .toFile(tempOut);

      const newStat = fs.statSync(tempOut);
      console.log(` -> WebP created: ${outWebpName} (${(newStat.size / 1024).toFixed(1)} KB)`);

      fs.renameSync(tempOut, outWebpPath);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

optimize();
