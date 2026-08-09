const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];

  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('http://127.0.0.1:8000/pages/account.html', { waituntil: 'load', timeout: 2000 });

  await page.locator('#loginIdentifier').fill('student@ldce.ac.in');
  await page.locator('#loginPassword').fill('wrongpass');
  await page.locator('#loginForm button[type="submit"]').click();
  await page.waitForTimeout(50);

  await page.locator('#showRegister').click();
  await page.locator('#fullName').fill('Test Student');
  await page.locator('#enrollmentNumber').fill('22CE999');
  await page.locator('#email').fill('student@ldce.ac.in');
  await page.locator('#branch').selectOption('Computer Engineering');
  await page.locator('#semester').selectOption('6');
  await page.locator('#password').fill('test123');
  await page.locator('#confirmPassword').fill('test123');
  await page.locator('#registerForm button[type="submit"]').click();
  await page.waitForTimeout(350);

  await page.locator('#loginIdentifier').fill('student@ldce.ac.in');
  await page.locator('#loginPassword').fill('test123');
  await page.locator('#loginForm button[type="submit"]').click();
  await page.waitForTimeout(50);

  await page.locator('#account-view').waitFor({ state: 'attached', timeout: 1000 });
  await page.locator('h2', { hasText: 'Library Summary' }).waitFor({ state: 'attached', timeout: 1000 });

  const summaryCard = await page.locator('#account-view').evaluate((node) => node.innerText);
  if (!summaryCard.includes('Library Summary')) {
    pageErrors.push('Library Summary missing');
  }

  const borrowedRows = await page.locator('#account-view .account-table tbody tr').count();
  if (borrowedRows < 3) {
    pageErrors.push('Borrowed table expected at least 3 sample rows');
  }

  const renewButton = page.locator('#account-view .renew-book').first();
  await renewButton.click();
  await page.waitForTimeout(30);

  await page.locator('#editProfileButton').click();
  await page.locator('#editFullName').fill('Test Student Updated');
  await page.locator('#profileEditForm button[type="submit"]').click();
  await page.waitForTimeout(50);

  const profileName = (await page.locator('#account-view').innerText()).includes('Test Student Updated');
  if (!profileName) {
    pageErrors.push('Profile edit not updated');
  }

  await page.locator('#logoutButton').click();
  await page.waitForTimeout(30);

  const loginVisibleText = (await page.locator('#account-view').innerText()).trim();
  if (!loginVisibleText.includes('Welcome Back')) {
    pageErrors.push('Login page not visible after logout');
  }

  await page.locator('#loginIdentifier').fill('student@ldce.ac.in');
  await page.locator('#loginPassword').fill('test123');
  await page.locator('#loginForm button[type="submit"]').click();
  await page.waitForTimeout(50);

  const historyText = (await page.locator('#account-view').innerText()).trim();
  if (!historyText.includes('Library History') || !historyText.includes('Data Structures') || !historyText.includes('Operating Systems')) {
    pageErrors.push('Library history content missing');
  }

  await browser.close();

  if (pageErrors.length || consoleErrors.length) {
    console.log(JSON.stringify({ pageErrors, consoleErrors }));
    process.exit(1);
  } else {
    console.log(JSON.stringify({ ok: true, checks: ['register','login','dashboard','borrowed','renew','profile edit','logout','library history'] }));
  }
})();
