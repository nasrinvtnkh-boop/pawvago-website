const { test, expect } = require('@playwright/test');

const fakeSupabase = `
window.__betaCalls = [];
window.__betaSubscriptions = [];
window.__betaSession = null;
window.__betaOtpError = null;
window.supabase = {
  createClient() {
    return {
      auth: {
        getSession: async () => ({ data: { session: window.__betaSession }, error: null }),
        onAuthStateChange: callback => {
          window.__betaSubscriptions.push(callback);
          return { data: { subscription: { unsubscribe() {} } } };
        },
        signInWithOtp: async (options) => {
          window.__betaCalls.push({ kind: 'otp', options });
          return window.__betaOtpError
            ? { error: { message: window.__betaOtpError } }
            : { error: null };
        },
        updateUser: async (options) => {
          window.__betaCalls.push({ kind: 'update', options });
          return { error: null };
        },
        signOut: async () => ({ error: null })
      }
    };
  }
};
`;

test.beforeEach(async ({ page }) => {
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', route =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: fakeSupabase })
  );
});

test('landing displays responsive beta section and accessible form', async ({ page }) => {
  await page.goto('/#beta');
  await expect(page.locator('#beta-heading')).toBeVisible();
  await expect(page.locator('#betaEmail')).toBeVisible();
  await expect(page.locator('#betaConsent')).not.toBeChecked();
  await expect(page.locator('#betaForm button[type=submit]')).toBeVisible();
  await expect(page.locator('a[href="#beta"]').first()).toBeVisible();
});

test('consent is required and email OTP is not sent when unchecked', async ({ page }) => {
  await page.goto('/');
  await page.locator('#betaEmail').fill('tester@example.com');
  await page.locator('#betaForm button[type=submit]').click();
  await expect(page.locator('#betaConsent')).not.toBeChecked();
  expect(await page.evaluate(() => window.__betaCalls.length)).toBe(0);
});

test('email-first registration sends an OTP with consent and source', async ({ page }) => {
  await page.goto('/?utm_source=instagram#beta');
  await page.locator('#betaEmail').fill('tester@example.com');
  await page.locator('#betaConsent').check();
  await page.locator('#betaForm button[type=submit]').click();
  await expect(page.locator('#betaNotice')).toContainText('Check your inbox');
  const calls = await page.evaluate(() => window.__betaCalls);
  expect(calls).toHaveLength(1);
  expect(calls[0].kind).toBe('otp');
  expect(calls[0].options.email).toBe('tester@example.com');
  expect(calls[0].options.options.data.pawvago_beta_consent).toBe(true);
  expect(calls[0].options.options.data.pawvago_beta_source).toBe('instagram');
  expect(calls[0].options.options.emailRedirectTo).toContain('?beta=confirmed#beta');
});

test('shows Supabase OTP delivery errors without claiming successful registration', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { window.__betaOtpError = 'Email sending temporarily unavailable'; });
  await page.locator('#betaEmail').fill('tester@example.com');
  await page.locator('#betaConsent').check();
  await page.locator('#betaForm button[type=submit]').click();
  await expect(page.locator('#betaNotice')).toContainText('Email sending temporarily unavailable');
  await expect(page.locator('#betaNotice')).toHaveAttribute('data-kind', 'error');
});

test('mobile beta form stays inside viewport', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.route('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', route =>
    route.fulfill({ status: 200, contentType: 'text/javascript', body: fakeSupabase })
  );
  await page.goto('/#beta');
  const form = page.locator('#betaForm');
  await expect(form).toBeVisible();
  const box = await form.boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(391);
  await page.close();
});

test('logged-in user can opt in without sending an OTP', async ({ page }) => {
  await page.goto('/?utm_source=youtube#beta');
  await page.evaluate(() => {
    window.__betaSession = { user: { email: 'member@example.com', user_metadata: {} } };
  });
  await page.locator('#betaEmail').fill('member@example.com');
  await page.locator('#betaConsent').check();
  await page.locator('#betaForm button[type=submit]').click();
  await expect(page.locator('#betaNotice')).toContainText('You are on the beta interest list');
  const calls = await page.evaluate(() => window.__betaCalls);
  expect(calls).toHaveLength(1);
  expect(calls[0].kind).toBe('update');
  expect(calls[0].options.data.pawvago_beta_source).toBe('youtube');
});

test('confirmed magic-link session records verified beta interest', async ({ page }) => {
  await page.goto('/?beta=confirmed#beta');
  await page.evaluate(() => {
    const callback = window.__betaSubscriptions.at(-1);
    if (!callback) throw new Error('Beta auth confirmation handler was not registered');
    callback('SIGNED_IN', {
      user: {
        email: 'confirmed@example.com',
        user_metadata: { pawvago_beta_source: 'instagram' }
      }
    });
  });
  await expect(page.locator('#betaNotice')).toContainText('Email confirmed');
  const calls = await page.evaluate(() => window.__betaCalls);
  expect(calls.filter(x => x.kind === 'update')).toHaveLength(1);
  expect(calls[0].options.data.pawvago_beta_source).toBe('instagram');
  await expect(page).toHaveURL(/#beta$/);
  expect(new URL(page.url()).searchParams.has('beta')).toBe(false);
});
