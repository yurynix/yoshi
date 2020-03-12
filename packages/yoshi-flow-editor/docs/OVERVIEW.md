# Out of IFrame App

- [Overview](#overview)
- [Initial Setup](#initial-setup)
- [Local Development](#local-development)
- [Testing](#testing)
  - [Viewer App](#viewer-app)
    - [E2E Against Production](#e2e-against-production)
    - [SSR](#ssr)
  - [Editor App & Settings Panel](#editor-app--settings-panel)
    - [E2E Against Locally Served HTMLs](#e2e-against-locally-served-htmls)
  - [Component & Unit Tests](#component--unit-tests)
- [Deployment](#deployment)
  - [Register an App in Wix's Dev Center](#register-an-app-in-wix-s-dev-center)
  - [Deploy a new version](#deploy-a-new-version)
- [OOI Development App](#ooi-development-app)

## Overview
> If you already has OOI experience and understand how it's working, just pass it to Local Development section.

`out-of-iframe` is a code name for a platform that enables creating Wix Apps that lives in the Viewer's main frame. It's similar to the old TPA but should be more performant. For more information head to the [official docs](https://bo.wix.com/wix-docs/client/client-frameworks#out-of-iframe).

For more info about current flow, take a look at the [RFC](https://github.com/wix/yoshi/issues/1489)

**OOI app is constructed from 2 parts:**

- **Viewer**
> Can include single or multple widgets. For example, component with list of items and item page.
Each widget contains of component (view) and controller (logic, runs on webWorker). All controllers are being collected in a single file called `viewerScript`.
So the result will be `[:widgetName]ViewerWidget.js` (for ex `buttonViewerWidget`) for each widget and single `viewerScript.js` for the whole app. These files is located in `dist/statics` directory.

- **Editor**
> To preview viewer script in editor, it's not enough to provide viewerWidget. Currently platoform will create an iframe for you widget. So instead of js bundle, you have to prodive html file. It should be deprecated in future.
Moreover, each of you widget should have Settings app. Here, you can provide ability for users to configure your widget. (color, logic, labels, etc).
The result will be `editor.html` and `settings.html` for each of your widgets located in `dist/statics/editor/:widgetName.html` and `dist/statics/settings/:widgetName.html`.


## Initial Setup

```
create-yoshi-app
> Your Name
> Your Email
> Editor FLow
> Typescript or Babel
```

> Note: We will use .ts files as an example, but you can use .js ones if you picked Babel project

This will bootstrap project with simple components (button, text).
Each component should contain 3 files:
- Widget.ts - *Will be rendered in both viewer and editor*.
- controller.ts - *Logical part of your widget running in WebWorker*
- Settings.ts - *Settings pannel for widget in editor*.


---
**Configure chrome to allow invalid certificates for resources loaded from localhost**

> The viewer is running on `https`, thus we need to serve our application on `https` as well. Yoshi is using a self signed certificate which is `invalid` for chrome.

Paste the following in Chrome's omnibox and change the highlighted flag from `Disabled` to `Enabled`.:

```
chrome://flags/#allow-insecure-localhost
```

## Local Development

**Develop your local app on production platforms**

```
npm start
```

This command runs `yoshi-flow-editor start` and opens two tabs:

1. Production **viewer** with a site that has the [ooi development app](#ooi-development-app), it points to your local _viewer script_ and _viewer widget_.

2. Production **editor** with a site that has the [ooi development app](#ooi-development-app), It points to your local _editor app_ and _settings panel_.

> Note: ooi-development-app is just an informative way to show how you can start your app in production environment. It's a pre-registered wix website with installed app pointed to localhost.
After understanding basic concept, we recommend you to read [Dev-Center registraion section](#dev-center-registration) and register your app.

## Dev-Center registration
To register your app please read: [Register your app via Dev Center](./DEV_CENTER_REGISTRATION.md)

#####After your app is registered
- update viewer and editor urls under `dev/sites.js`
- create/update `.component.json` which is located in each component's directory. This file should contain `id` field, which is pointing to appropriate widget registered on dev center.

## Testing

Run `npm start`, open another terminal and run `npx jest --watch`

> Tip - If you are using `iterm2` use `cmd`+`d` to split the window vertically

### Viewer App

#### E2E Against Production

Using the ooi development app that points to your local _viewer script_ and _viewer widget_.

See [`viewerApp/viewerApp.e2e.js`](./src/viewerApp/viewerApp.e2e.js) for an example.

#### SSR

> TBD

### Editor App & Settings Panel

#### E2E Against Locally Served HTMLs

When running tests, Yoshi runs your [`dev/server.js`](./dev/server.js) as configured in [`jest-yoshi.config.js`](./jest-yoshi.config.js).

See [`editorApp/editorApp.e2e.js`](./src/editorApp/editorApp.e2e.js) & [`settingsPanel/settingsPanel.e2e.js`](./src/settingsPanel/settingsPanel.e2e.js) for an example.

> Testing against the production editor similarly to the viewer app is problematic due to the editor loading time and required authentication.

### Component & Unit Tests

Nothing special about the ooi platform, component tests should be written in the `components` directory. Unit tests can be written everywhere.
