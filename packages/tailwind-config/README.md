# @repo/tailwind-config

## Overview

Shared Tailwind CSS configuration for the portals. This package exposes a single `tailwind.config.js` so all apps can share a consistent design system.

## Usage

In an app's `tailwind.config.js`:

```js
const sharedConfig = require("@repo/tailwind-config");

module.exports = {
  ...sharedConfig,
  content: ["./src/**/*.{ts,tsx}"]
};
```

## Related Docs

- [CI/CD Pipeline](../../docs/cicd-pipeline.md)
