import { method } from 'yoshi-server';

export const greet = method(function(name) {
  // @ts-ignore
  const csrfProtected = this.req.csrfProtected ? 'csrfProtected' : '';
  return {
    greeting: `hello ${name} ${csrfProtected}`,
    name,
  };
});
