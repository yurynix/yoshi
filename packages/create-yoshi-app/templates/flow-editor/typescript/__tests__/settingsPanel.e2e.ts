describe('Settings Panel', () => {
  it('should display 1 header', async () => {
    await page.goto('https://localhost:3100/settings/todo');

    expect(await page.$$eval('h2', headers => headers.length)).toBe(1);
  });
});
