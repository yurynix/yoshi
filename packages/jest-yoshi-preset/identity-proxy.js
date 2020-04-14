// Modified identity-obj-proxy.
// Based on:
// https://github.com/keyz/identity-obj-proxy/issues/8#issuecomment-430241345

const proxy = new Proxy(
  {},
  {
    get: (target, key) => {
      switch (key) {
        case '__esModule':
          return true;
        case 'default':
          return proxy;
        default:
          return key;
      }
    },
  },
);

module.exports = proxy;
