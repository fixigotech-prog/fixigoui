import {test as it} from '@playwright/test';

it('shows localized server errors in the login form', async ({page}) => {
  await page.goto('/login');
  await page.getByRole('textbox', {name: 'Email'}).fill('jane@doe.com');
  await page.getByRole('textbox', {name: 'Password'}).fill('invalid');
  await page.getByRole('textbox', {name: 'Password'}).press('Enter');
  await page.getByText('Please check your credentials.').isVisible();

  await page.getByRole('combobox', {name: 'Language'}).click();
  await page.getByRole('option', {name: 'हिन्दी'}).click();
  await page.getByRole('textbox', {name: 'Email'}).fill('jane@doe.com');
  await page.getByRole('textbox', {name: 'पासवर्ड'}).fill('invalid');
  await page.getByRole('textbox', {name: 'पासवर्ड'}).press('Enter');
  await page.getByText('कृपया अपनी क्रेडेंशियल्स जांचें।').isVisible();
});

it('can login and switch the language', async ({page}) => {
  await page.goto('/login');
  await page.getByRole('textbox', {name: 'Email'}).fill('jane@doe.com');
  await page.getByRole('textbox', {name: 'Password'}).fill('next-intl');
  await page.getByRole('textbox', {name: 'Password'}).press('Enter');
  await page.getByRole('heading', {name: 'Home'}).isVisible();
  await page.getByRole('combobox', {name: 'Language'}).click();
  await page.getByRole('option', {name: 'हिन्दी'}).click();
  await page.getByRole('heading', {name: 'होम'}).isVisible();
});
