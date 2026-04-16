/**
 * PDFファイル名からキャリバーメタデータを生成するスクリプト
 * 615個のPDFファイルをスキャンしてJSONを生成
 */

import { glob } from 'glob';
import { writeFileSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';

const PDF_DIR = './pdf';
const OUTPUT_DIR = './src/data';
const OUTPUT_FILE = join(OUTPUT_DIR, 'calibers.json');

/**
 * ファイル名からキャリバー情報をパースする
 * @param {string} filename - ファイル名（拡張子付き）
 * @returns {Object} パース結果
 */
function parseFilename(filename) {
  const nameWithoutExt = basename(filename, extname(filename));
  
  // 補足文書フラグ
  const isSupplement = /supplement|pt\d+|part\d+/i.test(nameWithoutExt);
  const isSeries = /series/i.test(nameWithoutExt);
  
  let calibers = [];
  let title = '';
  let category = inferCategory(nameWithoutExt);
  
  if (isSeries) {
    // シリーズ形式: "2A_series", "65series", "7M_Series"
    const seriesMatch = nameWithoutExt.match(/^([a-zA-Z0-9]+)[_-]?series$/i);
    if (seriesMatch) {
      calibers = [`${seriesMatch[1].toUpperCase()}シリーズ`];
      title = `${seriesMatch[1].toUpperCase()}シリーズ 取扱説明書`;
    }
  } else if (nameWithoutExt.includes('_')) {
    // アンダースコア区切り: "2A22A_23A_29A_32A", "7T32B_7T42B", "1N00A_1N01A"
    const parts = nameWithoutExt.split('_');
    calibers = expandCaliberPrefixes(parts);
    title = calibers.join(', ') + ' 取扱説明書';
  } else if (nameWithoutExt.includes('-')) {
    // ハイフン区切り（パート番号等）: "1320A-1", "7D48-pt1"
    if (/^\d+[A-Z]?-\d+$/.test(nameWithoutExt) || /-pt\d+/i.test(nameWithoutExt)) {
      // 単一キャリバーのパート形式
      calibers = [nameWithoutExt];
      title = `${nameWithoutExt} 取扱説明書`;
    } else {
      // キャリバー同士のハイフン区切り
      const parts = nameWithoutExt.split('-');
      calibers = expandCaliberPrefixes(parts);
      title = calibers.join(', ') + ' 取扱説明書';
    }
  } else {
    // 単一キャリバー: "7T32A", "VX3"
    calibers = [nameWithoutExt.toUpperCase()];
    title = `${nameWithoutExt.toUpperCase()} 取扱説明書`;
  }
  
  // 補足文書の場合、タイトルに追記
  if (isSupplement) {
    title = title.replace('取扱説明書', '補足説明書');
  }
  
  return {
    filename: filename,
    calibers: calibers,
    title: title,
    category: category,
    isSupplement: isSupplement,
    isSeries: isSeries,
  };
}

/**
 * キャリバープレフィックスを展開する
 * 例: ["2A22A", "23A", "29A"] → ["2A22A", "2A23A", "2A29A"]
 * 例: ["0644A", "0664A"] → ["0644A", "0664A"]（完全な番号はそのまま）
 * @param {string[]} parts - ファイル名を分割した配列
 * @returns {string[]} 展開されたキャリバー番号配列
 */
function expandCaliberPrefixes(parts) {
  if (parts.length === 0) return [];
  
  const result = [];
  
  // 最初の部分からプレフィックスパターンを解析
  const firstPart = parts[0];
  
  // 完全なキャリバー番号パターン: 数字+アルファベット+数字（+アルファベット）
  const fullPattern = /^([0-9]+)([A-Z])([0-9]+)([A-Z]?)$/i;
  
  // 最初の要素が完全なパターンにマッチするか確認
  const firstMatch = firstPart.match(fullPattern);
  
  if (!firstMatch) {
    // マッチしない場合はそのまま返す
    return parts.map(p => p.toUpperCase());
  }
  
  const [, firstNum, firstAlpha, firstNum2, firstSuffix] = firstMatch;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // 完全な形式かどうかチェック
    const partMatch = part.match(fullPattern);
    
    if (partMatch) {
      // 完全な形式の場合はそのまま使用
      result.push(part.toUpperCase());
    } else if (/^[0-9]+[A-Z]?$/i.test(part)) {
      // 短縮形（数字のみまたは数字+アルファベット1文字）の場合、プレフィックスを付与
      const shortMatch = part.match(/^([0-9]+)([A-Z]?)$/i);
      if (shortMatch) {
        const num = shortMatch[1];
        const suffix = shortMatch[2] || '';
        // 最初の要素のプレフィックス（数字+アルファベット）を使用
        result.push(`${firstNum}${firstAlpha}${num}${suffix}`.toUpperCase());
      } else {
        result.push(part.toUpperCase());
      }
    } else {
      result.push(part.toUpperCase());
    }
  }
  
  return result;
}

/**
 * ファイル名からカテゴリを推測する
 * @param {string} filename - ファイル名
 * @returns {string} カテゴリ
 */
function inferCategory(filename) {
  const upper = filename.toUpperCase();
  
  // Digital系（Dで始まる、または特定パターン）
  if (/^[0-9]*D[0-9]/i.test(upper) || /^VD[0-9]/i.test(upper) || /DIGITAL/i.test(upper)) {
    return 'Digital';
  }
  
  // VX系（クォーツムーブメント）
  if (/^VX/i.test(upper)) {
    return 'Quartz';
  }
  
  // VJ, VK系（クォーツ）
  if (/^V[JKTY][0-9]/i.test(upper)) {
    return 'Quartz';
  }
  
  // 7T, 8T系（クロノグラフ等）
  if (/^[78]T/i.test(upper)) {
    return 'Quartz';
  }
  
  // 1A, 2A系（デジタル多し）
  if (/^[12]A[0-9]/i.test(upper)) {
    return 'Digital';
  }
  
  // 1E, 1M, 1N系（クォーツ）
  if (/^1[EMN][0-9]/i.test(upper)) {
    return 'Quartz';
  }
  
  // 4M, 5M, 6M, 7M系（クォーツ）
  if (/^[4567]M[0-9]/i.test(upper)) {
    return 'Quartz';
  }
  
  // Y, S系
  if (/^[YS][0-9]/i.test(upper)) {
    return 'Quartz';
  }
  
  // W系
  if (/^W[0-9]/i.test(upper)) {
    return 'Quartz';
  }
  
  // A8系
  if (/^A8/i.test(upper)) {
    return 'Digital';
  }
  
  // S1系
  if (/^S1/i.test(upper)) {
    return 'Quartz';
  }
  
  // YM系
  if (/^YM/i.test(upper)) {
    return 'Quartz';
  }
  
  // YL, YT系
  if (/^Y[LT]/i.test(upper)) {
    return 'Quartz';
  }
  
  // 2xxx系（デジタル多し）
  if (/^2[0-9]{3}/i.test(upper)) {
    return 'Digital';
  }
  
  // その他の数字系
  if (/^[0-9]{4}/i.test(upper)) {
    return 'Quartz';
  }
  
  // シリーズ
  if (/series/i.test(upper)) {
    if (/[DM]\d*[_-]?series/i.test(upper)) return 'Digital';
    if (/[TVY]\d*[_-]?series/i.test(upper)) return 'Quartz';
    return 'Other';
  }
  
  return 'Other';
}

/**
 * メイン処理
 */
async function main() {
  console.log('🔍 PDFファイルをスキャンしています...');
  
  // PDFファイル一覧を取得
  const pdfFiles = await glob('*.pdf', { cwd: PDF_DIR });
  console.log(`📄 ${pdfFiles.length}個のPDFファイルを検出`);
  
  // 各ファイルをパース
  const manifest = [];
  const caliberMap = new Map(); // caliber -> pdf info
  
  for (const filename of pdfFiles.sort()) {
    try {
      const info = parseFilename(filename);
      manifest.push(info);
      
      // 各キャリバーとPDFのマッピング
      for (const caliber of info.calibers) {
        if (!caliberMap.has(caliber)) {
          caliberMap.set(caliber, []);
        }
        caliberMap.get(caliber).push(info);
      }
    } catch (error) {
      console.warn(`⚠️ ${filename} のパースに失敗:`, error.message);
    }
  }
  
  // 出力ディレクトリを作成
  mkdirSync(OUTPUT_DIR, { recursive: true });
  
  // カテゴリ統計
  const categoryStats = {};
  manifest.forEach(item => {
    categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
  });
  
  // 結果をJSONとして保存
  const output = {
    totalFiles: manifest.length,
    totalCalibers: caliberMap.size,
    categoryStats: categoryStats,
    files: manifest,
    caliberMap: Object.fromEntries(caliberMap),
  };
  
  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8');
  
  console.log('\n✅ データ生成完了!');
  console.log(`   ファイル数: ${output.totalFiles}`);
  console.log(`   キャリバー数: ${output.totalCalibers}`);
  console.log(`   カテゴリ内訳:`, categoryStats);
  console.log(`\n📁 出力: ${OUTPUT_FILE}`);
  
  // サンプル表示
  console.log('\n📝 サンプルデータ:');
  manifest.slice(0, 5).forEach(item => {
    console.log(`   ${item.filename} → ${item.calibers.join(', ')} (${item.category})`);
  });
}

main().catch(console.error);
