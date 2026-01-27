# @repo/database

## Overview

Shared Prisma client and Zod schemas for the University-SSO platform. Provides a singleton Prisma client and typed validation helpers.

## Responsibilities

- Export a shared Prisma client instance.
- Provide Zod schemas and enums used across services and apps.
- Centralize database configuration and types.

## Key Exports

- Default export: Prisma client singleton.
- `PrismaClient` type and Prisma models.
- Zod schemas and enums from `src/zod`.

## Common Scripts

```bash
npm run db:generate
```

```bash
npm run db:push
```

## Related Docs

- [WSO2 Configuration](../../docs/wso2-configuration.md)
