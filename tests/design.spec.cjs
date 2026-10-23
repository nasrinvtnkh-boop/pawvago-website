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
  await expect(page.locator('#travel-tools')).toHaveAttribute('open', '');
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

test('scroll line advances and back-to-top returns to beginning', async ({ page }) => {
  await page.goto('/');
  const progress = page.locator('.pv-scroll-guide');
  const top = page.getByRole('button',{name:'Back to top of page'});
  await expect(progress).toHaveCount(1);
  await expect(top).toBeHidden();
  await page.evaluate(() => window.scrollTo(0, Math.max(1000, document.documentElement.scrollHeight * .5)));
  await expect(top).toBeVisible();
  await expect(progress).toBeVisible();
  const ratio = await progress.evaluate(el => {
    const transform = getComputedStyle(el).transform;
    return Number(transform.match(/^matrix\(([^,]+)/)?.[1] || 0);
  });
  expect(ratio).toBeGreaterThan(.12);
  await top.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(30);
});

test('trip planner expands only on demand and retains graceful reveal', async ({ page }) => {
  await page.goto('/');
  const drawer = page.locator('#travel-tools');
  await expect(drawer).not.toHaveAttribute('open', '');
  await expect(page.locator('#pvj-heading')).toBeHidden();
  await expect(page.locator('#pvj-directory-search')).toBeHidden();
  await page.locator('.pvj-explorer-trigger').click();
  await expect(drawer).toHaveAttribute('open', '');
  await page.locator('#journey-lab').scrollIntoViewIfNeeded();
  await expect(page.locator('#pvj-heading')).toBeVisible();
  await expect(page.locator('.pvj-shell')).toBeVisible();
  expect(await page.locator('.pvj-shell').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.locator('#airline-directory')).not.toHaveAttribute('open', '');
  await page.locator('.pvj-airline-summary').click();
  await expect(page.locator('#airline-directory')).toHaveAttribute('open', '');
  await expect(page.locator('#pvj-directory-search')).toBeVisible();
  await page.locator('.pvj-airline-summary').click();
  await expect(page.locator('#pvj-directory-search')).toBeHidden();
  await page.locator('.pvj-explorer-close').click();
  await expect(drawer).not.toHaveAttribute('open', '');
  await expect(page.locator('#pvj-heading')).toBeHidden();
});
test('deep links open the collapsed travel checker', async ({ page }) => {
  await page.goto('/#policy-library');
  await expect(page.locator('#travel-tools')).toHaveAttribute('open', '');
  await expect(page.locator('#airline-directory')).toHaveAttribute('open', '');
  await expect(page.locator('#pvj-directory-search')).toBeVisible();
  await page.goto('/#travel-faq');
  await expect(page.locator('#travel-tools')).toHaveAttribute('open', '');
  await expect(page.locator('#pvj-faq-title')).toBeVisible();
});
test('keyboard visitors can open and close travel tools', async ({ page }) => {
  await page.goto('/');
  const drawer = page.locator('#travel-tools');
  await page.locator('.pvj-explorer-trigger').focus();
  await page.keyboard.press('Enter');
  await expect(drawer).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(drawer).not.toHaveAttribute('open', '');
});

test('reduced-motion visitors get the full content without animated progress', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  await page.goto('/');
  await expect(page.locator('.pv-scroll-guide')).toBeHidden();
  expect(await page.locator('.pv-reveal').count()).toBe(0);
  await page.locator('.pvj-explorer-trigger').click();
  await expect(page.locator('#travel-tools')).toHaveAttribute('open', '');
  await expect(page.locator('.pvj-shell')).toBeVisible();
});

test('airline catalogue loads and KLM can be found', async ({ page }) => {
  await page.goto('/');
  await page.locator('.pvj-explorer-trigger').click();
  await page.locator('.pvj-airline-summary').click();
  await expect(page.locator('#pvj-audit')).not.toContainText('Policy data unavailable', {timeout:15000});
  const search = page.locator('#pvj-directory-search');
  await search.fill('KLM');
  await expect(page.locator('#pvj-rule-cards')).toContainText('KLM', {timeout:15000});
  await expect(page.locator('#pvj-rule-cards')).not.toContainText('Official-source reference data could not be loaded');
});
