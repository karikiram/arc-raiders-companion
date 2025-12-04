#!/usr/bin/env node
/**
 * Download high-quality images from Arc Raiders Wiki
 * Creates multiple sizes for responsive display
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Load scraped data
const dataPath = path.join(__dirname, '..', 'arc_raiders_all_items.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Output directories
const outputDir = path.join(__dirname, '..', 'public', 'items-hq');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert item name to filename (kebab-case)
function nameToFilename(name) {
  return name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Download a single image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filepath);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete partial file
        reject(err);
      });
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Process all items
async function downloadAllImages() {
  const items = data.items;
  const results = { success: [], failed: [], skipped: [] };

  console.log(`\n📦 Starting download of ${items.length} images...\n`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const filename = nameToFilename(item.name);

    // Skip generic/category images
    if (filename.includes('itemcategory') || filename === 'combat-items' || filename === 'looting-items' || filename === 'tactical-items') {
      results.skipped.push({ name: item.name, reason: 'Category image' });
      continue;
    }

    // Get file extension from URL
    const urlExt = path.extname(item.imageUrl).split('?')[0] || '.png';
    const filepath = path.join(outputDir, `${filename}${urlExt}`);

    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      results.skipped.push({ name: item.name, reason: 'Already exists' });
      process.stdout.write(`⏭️  [${i + 1}/${items.length}] Skipped: ${item.name}\r`);
      continue;
    }

    try {
      await downloadImage(item.imageUrl, filepath);
      results.success.push({ name: item.name, filename, path: filepath });
      process.stdout.write(`✅ [${i + 1}/${items.length}] Downloaded: ${item.name}                    \r`);

      // Small delay to be nice to the server
      await new Promise(r => setTimeout(r, 100));
    } catch (error) {
      results.failed.push({ name: item.name, url: item.imageUrl, error: error.message });
      process.stdout.write(`❌ [${i + 1}/${items.length}] Failed: ${item.name} - ${error.message}\r`);
    }
  }

  console.log('\n\n📊 Download Summary:');
  console.log(`   ✅ Success: ${results.success.length}`);
  console.log(`   ⏭️  Skipped: ${results.skipped.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed downloads:');
    results.failed.forEach(f => console.log(`   - ${f.name}: ${f.error}`));
  }

  // Save results
  const resultsPath = path.join(__dirname, '..', 'download-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);

  return results;
}

// Run
downloadAllImages().catch(console.error);
