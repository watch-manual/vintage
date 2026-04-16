import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfDir = path.join(__dirname, '..', 'public', 'pdf');
const thumbDir = path.join(__dirname, '..', 'public', 'thumbnails');

async function generateThumbnails() {
  if (!fs.existsSync(thumbDir)) {
    fs.mkdirSync(thumbDir, { recursive: true });
  }

  const files = fs.readdirSync(pdfDir).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`🖼️  ${files.length}個のPDFサムネイルを生成中...`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of files) {
    const basename = path.basename(file, path.extname(file));
    const outPath = path.join(thumbDir, `${basename}.webp`);

    if (fs.existsSync(outPath)) {
      skipped++;
      continue;
    }

    const pdfPath = path.join(pdfDir, file);
    const tmpPrefix = path.join(thumbDir, `tmp-${Date.now()}-${basename}`);

    try {
      await new Promise((resolve, reject) => {
        const proc = spawn('pdftoppm', ['-png', '-singlefile', '-f', '1', '-l', '1', '-r', '150', pdfPath, tmpPrefix]);
        proc.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`pdftoppm exited with ${code}`));
        });
        proc.on('error', reject);
      });

      const generated = `${tmpPrefix}.png`;
      if (!fs.existsSync(generated)) {
        throw new Error('generated png not found');
      }

      await sharp(generated)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outPath);

      fs.unlinkSync(generated);
      created++;
      console.log(`  ✓ ${basename}.webp`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${file}:`, err.message);
      // クリーンアップ
      const generated = `${tmpPrefix}.png`;
      if (fs.existsSync(generated)) {
        try { fs.unlinkSync(generated); } catch {}
      }
    }
  }

  console.log(`✅ サムネイル生成完了 (新規: ${created}, スキップ: ${skipped}, 失敗: ${failed})`);
}

generateThumbnails().catch((err) => {
  console.error(err);
  process.exit(1);
});
