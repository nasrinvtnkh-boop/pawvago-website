const { test, expect } = require('@playwright/test');

test('homepage explains product and offers normal account signup', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Leave the guesswork');
  await expect(page.locator('#homeView')).toBeVisible();
  await expect(page.locator('#heroSignup')).toHaveText(/Create free account/);
  expect(await page.locator('[id="beta"], #betaForm').count()).toBe(0);
  await page.locator('#heroSignup').click();
  await expect(page.locator('#authModal')).toBeVisible();
  await expect(page.locator('#authTitle')).toContainText('Create your account');
  await expect(page.locator('#authForm #email')).toBeVisible();
  await expect(page.locator('#authForm #password')).toBeVisible();
});

test('navigation and on-page anchors work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav[aria-label="Main navigation"] a')).toHaveCount(5);
  for (const item of await page.locator('nav[aria-label="Main navigation"] a').all()) {
    const href = await item.getAttribute('href');
    expect(href).toMatch(/^#[\w-]+$/);
    await expect(page.locator(href)).toHaveCount(1);
  }
  await page.locator('a.hero-inline-link').click();
  await expect(page).toHaveURL(/#journey-lab$/);
  await expect(page.locator('#pvj-heading')).toBeVisible();
});

test('mobile menu opens and closes accessibly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('.pv-menu-toggle');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.desktop-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('responsive content and main CTA stay inside viewport', async ({ browser }) => {
  for (const width of [375, 390, 768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('.hero h1')).toBeVisible();
    await expect(page.locator('#heroSignup')).toBeVisible();
    const dimensions = await page.evaluate(() => {
      const rect = document.getElementById('heroSignup').getBoundingClientRect();
      const title = document.querySelector('.hero h1').getBoundingClientRect();
      return { viewport: window.innerWidth, buttonLeft: rect.left, buttonRight: rect.right,
        titleLeft: title.left, titleRight: title.right,
        docWidth: document.documentElement.scrollWidth };
    });
    expect(dimensions.buttonLeft, String(width)).toBeGreaterThanOrEqual(-1);
    expect(dimensions.buttonRight, String(width)).toBeLessThanOrEqual(width + 1);
    expect(dimensions.titleLeft, String(width)).toBeGreaterThanOrEqual(-1);
    expect(dimensions.titleRight, String(width)).toBeLessThanOrEqual(width + 1);
    expect(dimensions.docWidth, 'horizontal overflow at ' + width).toBeLessThanOrEqual(width + 2);
    await page.close();
  }
});

test('professional typography, contrast and SEO metadata are present', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Plan international trips/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /PawVago/);
  await expect(page.locator('link[href="professional.css"]')).toHaveCount(1);
  await expect(page.locator('a.skip-link')).toHaveAttribute('href','#top');
  const style = await page.locator('#heroSignup').evaluate(node => {
    const a = getComputedStyle(node);
    return { bg:a.backgroundColor,color:a.color,font:a.fontFamily };
  });
  expect(style.bg).toBe('rgb(23, 45, 59)');
  expect(style.color).toBe('rgb(255, 255, 255)');
});

test('save preview screenshots at desktop and mobile sizes', async ({ browser }) => {
  for (const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
    const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce' });
    await page.goto('/');
    await page.locator('.hero').screenshot({ path: 'qa-' + name + '.png', animations:'disabled' });
    await page.close();
  }
});
