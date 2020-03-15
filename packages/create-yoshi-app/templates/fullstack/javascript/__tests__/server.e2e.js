describe('When rendering', () => {
  it('should display a title', async () => {
    const response = await axios.get('/');

    expect(response.data).toContain('Wix Full Stack Project Boilerplate');
  });
});
