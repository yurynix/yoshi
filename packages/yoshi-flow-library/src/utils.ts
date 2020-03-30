export const stripOrganization = (name: string): string =>
  name.slice(name.indexOf('/') + 1);
