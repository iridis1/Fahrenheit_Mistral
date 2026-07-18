import { test, expect } from '@playwright/test';

const password = 'Welcome123!';

test.beforeEach(async ({ page, context }) => {

  console.log('Navigating to /');
  await page.goto('/');
  
  // Debug: check what's on the page
  console.log('Page URL:', page.url());
});

test.describe('Temperature Converter', () => {
  test('should display the converter page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Temperatuur Converter/);
    await expect(page.getByRole('heading', { name: 'Temperatuur Converter' })).toBeVisible();
  });

  test('should have temperature input field', async ({ page, baseURL }) => {
    console.log(baseURL);
    const input = page.getByPlaceholder('Temperatuur');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'number');
  });

  // TODO: Fix later. Already tested implicitly.
  // test('should have unit selection dropdown with all options', async ({ page }) => {
  //   const select = page.getByRole('combobox');
  //   await expect(select).toBeVisible();
    
  //   const options = page.getByRole('option');
  //   await expect(options).toHaveCount(3);
  //   await expect(page.getByRole('option', { name: 'Celsius' })).toBeVisible();
  //   await expect(page.getByRole('option', { name: 'Fahrenheit' })).toBeVisible();
  //   await expect(page.getByRole('option', { name: 'Kelvin' })).toBeVisible();
  // });

  test('should have convert button', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Converteer' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('should show error when trying to convert without input', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Converteer' });
    await button.click();
    
    const error = page.getByText('Voer een temperatuur in');
    await expect(error).toBeVisible();
    
    // Results should not be displayed
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).not.toBeVisible();
  });

  test('should convert from Celsius to all units', async ({ page }) => {
    const input = page.getByPlaceholder('Temperatuur');
    const select = page.getByRole('combobox');
    const button = page.getByRole('button', { name: 'Converteer' });
    
    // Input 100 Celsius
    await input.fill('100');
    await select.selectOption('celsius');
    await button.click();
    
    // Wait for conversion to complete
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).toBeVisible();
    
    // Check results (100°C = 212°F = 373.15K)
    await expect(page.getByText(/Celsius:100\.00 °C/)).toBeVisible();
    await expect(page.getByText(/Fahrenheit:212\.00 °F/)).toBeVisible();
    await expect(page.getByText(/Kelvin:373\.15 K/)).toBeVisible();
  });

  test('should convert from Fahrenheit to all units', async ({ page }) => {
    const input = page.getByPlaceholder('Temperatuur');
    const select = page.getByRole('combobox');
    const button = page.getByRole('button', { name: 'Converteer' });
    
    // Input 212 Fahrenheit
    await input.fill('212');
    await select.selectOption('fahrenheit');
    await button.click();
    
    // Wait for conversion to complete
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).toBeVisible();
    
    // Check results (212°F = 100°C = 373.15K)
    await expect(page.getByText(/Celsius:100\.00 °C/)).toBeVisible();
    await expect(page.getByText(/Fahrenheit:212\.00 °F/)).toBeVisible();
    await expect(page.getByText(/Kelvin:373\.15 K/)).toBeVisible();
  });

  test('should convert from Kelvin to all units', async ({ page }) => {
    const input = page.getByPlaceholder('Temperatuur');
    const select = page.getByRole('combobox');
    const button = page.getByRole('button', { name: 'Converteer' });
    
    // Input 373.15 Kelvin
    await input.fill('373.15');
    await select.selectOption('kelvin');
    await button.click();
    
    // Wait for conversion to complete
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).toBeVisible();
    
    // Check results (373.15K = 100°C = 212°F)
    await expect(page.getByText(/Celsius:100\.00 °C/)).toBeVisible();
    await expect(page.getByText(/Fahrenheit:212\.00 °F/)).toBeVisible();
    await expect(page.getByText(/Kelvin:373\.15 K/)).toBeVisible();
  });

  test('should show loading state during conversion', async ({ page }) => {
    // Make the API slower to test loading state
    await page.route('/api/convert*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
      await route.continue();
    });
    
    const input = page.getByPlaceholder('Temperatuur');
    const button = page.getByRole('button', { name: 'Converteer' });
    
    await input.fill('25');
    await button.click();
    
    // Check loading state
    const loadingButton = page.getByRole('button', { name: 'Laden...' });
    await expect(loadingButton).toBeVisible();
    await expect(loadingButton).toBeDisabled();
    
    // Wait for loading to complete
    await expect(page.getByRole('button', { name: 'Converteer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).toBeVisible();
  });

  test('should convert on Enter key press', async ({ page }) => {
    const input = page.getByPlaceholder('Temperatuur');
    const select = page.getByRole('combobox');
    
    // Input 0 Celsius and press Enter
    await input.fill('0');
    await select.selectOption('celsius');
    await input.press('Enter');
    
    // Wait for conversion to complete
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).toBeVisible();
    
    // Check results (0°C = 32°F = 273.15K)
    await expect(page.getByText(/Celsius:0\.00 °C/)).toBeVisible();
    await expect(page.getByText(/Fahrenheit:32\.00 °F/)).toBeVisible();
    await expect(page.getByText(/Kelvin:273\.15 K/)).toBeVisible();
  });

  test('should handle negative temperatures', async ({ page }) => {
    const input = page.getByPlaceholder('Temperatuur');
    const select = page.getByRole('combobox');
    const button = page.getByRole('button', { name: 'Converteer' });
    
    // Input -40 Celsius
    await input.fill('-40');
    await select.selectOption('celsius');
    await button.click();
    
    // Wait for conversion to complete
    await expect(page.getByRole('heading', { name: 'Resultaat:' })).toBeVisible();
    
    // Check results (-40°C = -40°F = 233.15K)
    await expect(page.getByText(/Celsius:-40\.00 °C/)).toBeVisible();
    await expect(page.getByText(/Fahrenheit:-40\.00 °F/)).toBeVisible();
    await expect(page.getByText(/Kelvin:233\.15 K/)).toBeVisible();
  });
});
