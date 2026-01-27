# @repo/logger

## Overview

Shared logging utilities built on Pino. Exposes a cached logger factory to avoid duplicate logger instances during development.

## Responsibilities

- Create and configure Pino loggers with consistent formatting.
- Provide redaction defaults for sensitive fields.
- Reuse logger instances across hot reloads.

## Key Exports

- `createLogger(config?: LoggerConfig)`
- `Logger`, `LoggerOptions` types

## Configuration

- `LOG_LEVEL` controls default log level.
- `NODE_ENV=development` enables `pino-pretty` formatting.

## Development

```bash
npm run build
```

```bash
npm run lint
```

```bash
npm run check-types
```
