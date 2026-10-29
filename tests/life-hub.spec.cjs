const {test,expect}=require("@playwright/test");

test("Travel Mode and Everyday Mode switch correctly",async({page})=>{
 await page.goto("/");
 const hub=page.locator("#paw-life-hub");
 await expect(hub).toBeVisible();
 await expect(page.locator("#pvl-travel")).toBeVisible();
 await expect(page.locator("#pvl-everyday")).toBeHidden();
 await page.locator("#pvl-tab-everyday").click();
 await expect(page.locator("#pvl-everyday")).toBeVisible();
 await expect(page.locator("#pvl-travel")).toBeHidden();
 await expect(page.locator("#pvl-tab-everyday")).toHaveAttribute("aria-selected","true");
 await page.locator("#pvl-tab-travel").click();
 await expect(page.locator("#pvl-travel")).toBeVisible();
});

test("anonymous user sees a sign-in prompt, not pet records",async({page})=>{
 await page.goto("/");
 await page.locator("#pvl-tab-everyday").click();
 await expect(page.locator("#pvl-pet-select")).toBeDisabled();
 await expect(page.locator("#pvl-account")).toContainText(/Sign in/);
 await page.locator("#pvl-reminder-form button[type=submit]").click();
 await expect(page.locator("#authModal")).toBeVisible();
});

test("no location is accessed until the user asks",async({page})=>{
 let calls=0;
 await page.addInitScript(()=>{
   window.__pvlGeoCalls=0;
   Object.defineProperty(navigator,"geolocation",{configurable:true,value:{
    getCurrentPosition(){window.__pvlGeoCalls++;},
   }});
 });
 await page.goto("/");
 await page.locator("#pvl-tab-everyday").click();
 expect(await page.evaluate(()=>window.__pvlGeoCalls)).toBe(0);
 await page.locator("#pvl-find-nearby").click();
 await expect.poll(()=>page.evaluate(()=>window.__pvlGeoCalls)).toBe(1);
});

test("Everyday section stays within mobile viewport",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 await page.locator("#pvl-tab-everyday").click();
 await expect(page.locator("#pvl-everyday")).toBeVisible();
 const widths=await page.evaluate(()=>({
  viewport:window.innerWidth,
  document:document.documentElement.scrollWidth,
  nearby:document.getElementById("pvl-nearby").getBoundingClientRect().width
 }));
 expect(widths.document).toBeLessThanOrEqual(widths.viewport+2);
 expect(widths.nearby).toBeLessThanOrEqual(widths.viewport);
});
