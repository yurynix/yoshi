describe('Settings Panel', () => {
  it('should display 1 header', async () => {
    await page.goto('https://localhost:3100/settings/button');

    expect(await page.$$eval('input', inputs => inputs.length)).toBe(1);
  });
});
