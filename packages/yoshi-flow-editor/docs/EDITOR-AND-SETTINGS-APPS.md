### Serving editor and settings apps.

#### Editor app and settings app.
Let's try to understand what the difference between it.
Actually, both apps are being rendered in editor envoronment. Editor app is an wrapper for widget rendered in iFrame.
Since editor is not supporting out of iframe widgets, we need to wrap it in html file or render on the server and then use it as an iframe src.
According to Editor spec, each widget should have settings. Via settings, we can allow users to configure out widget from logical parts to design updates.

#### Local development
For local development you have to use `yoshi start`.

It creates dev server with HMR working. You can access each of you widget under:
App: https://localhost:3000/editor/:componentName
Settings: https://localhost:3000/settings/:componentName

`:componentName` is an a name of the component's directory. For example, for `components/button` it will be `https://localhost:3000/editor/button`.

#### Prod usage
In most cases, settings app is pretty simple and you don't need to have production service which renders it. For more info, check the RFC: [#2013](https://github.com/wix/yoshi/issues/2013).
So yoshi provides ability to use **.html** files for editor apps and settings.
Use your bundle CDN urls in dev-center, which is available under:

- App: `https://static.parastorage.com/services/${ARTIFACT_NAME}/1.0.0/editor/{WIDGET_NAME}.html`  
- Settings: `https://static.parastorage.com/services/${ARTIFACT_NAME}/1.0.0/settings/{WIDGET_NAME}.html`  