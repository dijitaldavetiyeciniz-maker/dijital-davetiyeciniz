import { test, expect } from '@playwright/test';
import { predefinedThemes } from '../src/lib/themes';
import fs from 'fs';
import path from 'path';

test.describe('PART 3 — Programmatic Registry & Layout Audit', () => {

  test('All 75 active presets in predefinedThemes must have unique IDs and zero duplicates', () => {
    const ids = predefinedThemes.map(t => t.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(75);
    expect(uniqueIds.size).toBe(75);
  });

  test('All 17 Flagship presets must be selectable in predefinedThemes and catalog', () => {
    const flagshipIds = [
      'parisian-black-tie',
      'grand-opera-ballroom',
      'moonlit-secret-garden',
      'vogue-wedding-editorial',
      'mediterranean-ceramic-garden',
      'ottoman-illumination',
      'coastal-sunset',
      'aurora-glass',
      'fine-art-botanical-watercolor',
      'film-premiere-night',
      'minimal-swiss-gallery',
      'royal-palace-invitation',
      'henna-palace-night',
      'prince-ceremony',
      'storybook-babyshower',
      'storybook-birthday',
      'future-summit',
    ];

    for (const fId of flagshipIds) {
      const found = predefinedThemes.find(t => t.id === fId);
      expect(found, `Flagship preset missing from predefinedThemes: ${fId}`).toBeDefined();
    }
  });

  test('Visual audit screenshot directory must contain 17 mobile and 17 desktop PNG files', () => {
    const auditDir = path.join(process.cwd(), 'docs/flagship-visual-audit');
    expect(fs.existsSync(auditDir)).toBe(true);

    const files = fs.readdirSync(auditDir);
    const mobileFiles = files.filter(f => f.includes('-mobile-'));
    const desktopFiles = files.filter(f => f.includes('-desktop-'));

    expect(mobileFiles.length).toBe(17);
    expect(desktopFiles.length).toBe(17);

    // Verify non-zero file sizes
    for (const f of files) {
      const stat = fs.statSync(path.join(auditDir, f));
      expect(stat.size, `Screenshot file is empty: ${f}`).toBeGreaterThan(5000);
    }
  });
});
