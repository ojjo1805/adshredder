import { build } from 'vite';
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

async function runBuild() {
  console.log('⚡ Starting build for AdShredder by Mojo...');

  // Ensure clean dist directory
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Build Popup HTML Application
  console.log('📦 Building Popup UI...');
  await build({
    root: path.resolve('src/popup'),
    base: '',
    build: {
      outDir: path.resolve('dist/popup'),
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve('src/popup/popup.html')
      }
    }
  });

  // 2. Build Background Service Worker (ES module)
  console.log('📦 Building Service Worker...');
  await build({
    build: {
      outDir: path.resolve('dist/background'),
      emptyOutDir: false,
      lib: {
        entry: path.resolve('src/background/service_worker.ts'),
        name: 'service_worker',
        formats: ['es'],
        fileName: () => 'service_worker.js'
      }
    }
  });

  // 3. Build Cosmetic Engine (Isolated Content Script - Standalone IIFE)
  console.log('📦 Building Cosmetic Engine & Element Picker...');
  await build({
    build: {
      outDir: path.resolve('dist/content'),
      emptyOutDir: false,
      lib: {
        entry: path.resolve('src/content/cosmetic_engine.ts'),
        name: 'cosmetic_engine',
        formats: ['iife'],
        fileName: () => 'cosmetic_engine.js'
      }
    }
  });

  // 4. Build Main World Defuser (Page Context Script - Standalone IIFE)
  console.log('📦 Building Main World Popup Defuser...');
  await build({
    build: {
      outDir: path.resolve('dist/content'),
      emptyOutDir: false,
      lib: {
        entry: path.resolve('src/content/main_world_defuser.ts'),
        name: 'main_world_defuser',
        formats: ['iife'],
        fileName: () => 'main_world_defuser.js'
      }
    }
  });

  // 5. Copy Manifest, Rules, CSS & Icons
  console.log('📋 Copying Manifest and static assets...');
  fs.copyFileSync(path.resolve('manifest.json'), path.join(distDir, 'manifest.json'));
  fs.copyFileSync(path.resolve('src/content/cosmetic.css'), path.join(distDir, 'content/cosmetic.css'));

  const rulesDest = path.join(distDir, 'rules');
  fs.mkdirSync(rulesDest, { recursive: true });
  fs.copyFileSync(path.resolve('src/rules/rules.json'), path.join(rulesDest, 'rules.json'));

  const iconsDest = path.join(distDir, 'icons');
  fs.mkdirSync(iconsDest, { recursive: true });
  const iconFiles = fs.readdirSync(path.resolve('src/icons'));
  for (const file of iconFiles) {
    fs.copyFileSync(path.resolve('src/icons', file), path.join(iconsDest, file));
  }

  console.log('✅ Build completed successfully! Extension ready in ./dist');
}

runBuild().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
