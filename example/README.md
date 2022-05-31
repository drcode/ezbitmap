# Running the example app

This is a minimal web app that uses ezbitmap. It requires npm and webpack to build.

To bundle the javascript code, execute:

```
npx webpack
```

That command bundles the javascript from `src` and puts it into `dist`.

To serve up the web app, go into the `dist` directory and type:

```
npm install -g http-server
http-server
```
