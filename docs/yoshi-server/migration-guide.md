## Migrating an Existing Project

### Prerequisits

- A fullstack app (both server and client are together, using the same `package.json` file).
- We currently support only projects using the `app-flow` ("projectType": "app" in your Yoshi configuration). If you do not it, please migrate first (see https://wix.github.io/yoshi/docs/guides/app-flow for more details)
- Using the `htmlWebpackPlugin` ("experimentalBuildHtml": true in your Yoshi configuration). Do not worry, if you are not using it, yet, this migration guide shows how to migrate. This should be pretty straight forward.

### Install dependencies

```
npn install yoshi-server yoshi-server-client
```

### Update `yoshi` config to use `yoshi-server`

```diff
"yoshi": {
  "projectType": "app",
+  "experimentalBuildHtml": true,
+  "yoshiServer": true,
...
}
```

Please note:

- Yoshi Server is only supported together with `app-plow` ("projectType": "app"). In case you are do not use it yet, please migrate: https://wix.github.io/yoshi/docs/guides/app-flow
