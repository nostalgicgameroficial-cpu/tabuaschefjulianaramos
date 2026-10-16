import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const artifactDir = 'C:/Users/welington/.gemini/antigravity-ide/brain/3e079daa-15ec-41ce-885b-0b85890c47f9';
const targetDir = path.resolve('./public/code_files');

const mapping = [
  { match: 'hero_caseirinhos', out: 'hero_caseirinhos.webp', width: 850 },
  { match: 'caseirinho_adesivo_redvelvet', out: 'caseirinho_adesivo_redvelvet.webp', width: 600 },
  { match: 'caseirinho_adesivo_ninho', out: 'caseirinho_adesivo_ninho.webp', width: 600 },
  { match: 'caseirinho_adesivo_meioameio', out: 'caseirinho_adesivo_meioameio.webp', width: 600 },
  { match: 'caseirinho_adesivo_cenoura', out: 'caseirinho_adesivo_cenoura.webp', width: 600 },
  { match: 'depoimento_whats_caseirinho_1', out: 'depoimento_whats_caseirinho_1.webp', width: 500 },
  { match: 'depoimento_whats_caseirinho_2', out: 'depoimento_whats_caseirinho_2.webp', width: 500 },
  { match: 'depoimento_whats_caseirinho_3', out: 'depoimento_whats_caseirinho_3.webp', width: 500 },
  { match: 'aluna_caseirinho_cozinha', out: 'aluna_caseirinho_cozinha.webp', width: 600 },
  { match: 'aluna_caseirinho_mordida', out: 'aluna_caseirinho_mordida.webp', width: 600 },
  { match: 'aluna_caseirinho_caixa', out: 'aluna_caseirinho_caixa.webp', width: 600 }
];

async function processImages() {
  const files = fs.readdirSync(artifactDir);

  for (const item of mapping) {
    const foundFile = files.find(f => f.startsWith(item.match) && (f.endsWith('.jpg') || f.endsWith('.png')));
    if (foundFile) {
      const srcPath = path.join(artifactDir, foundFile);
      const destPath = path.join(targetDir, item.out);

      await sharp(srcPath)
        .resize({ width: item.width, fit: 'inside' })
        .webp({ quality: 82 })
        .toFile(destPath);

      console.log(`Converted ${foundFile} -> ${item.out}`);
    } else {
      console.warn(`Could not find file matching ${item.match}`);
    }
  }
}

processImages();
