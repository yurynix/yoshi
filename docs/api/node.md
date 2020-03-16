---
id: node
title: Node API
sidebar_label: Node API
---

## Yoshi Serve

`yoshi-common` exposes `serve` functionality through Node API.

Serve runs your `index-dev`/`dev/server` file and serves your `dist/statics` directory as a local CDN.

> Note: You need to build the statics before running serve. You can do that with `yoshi build`.

`serve` method returns a Promise.

Example of usage:

```javascript
const serve = require("yoshi-common/serve");

serve()
  .then(() => {
    console.log("Server and CDN started successfully");
  })
  .catch(errorReason => {
    console.log(errorReason);
  });
```
