# @repo/api-client

## Overview

Shared API client utilities for frontend packages. Provides a small wrapper to execute backend actions safely and normalize error handling.

## Responsibilities

- Wrap async service calls and translate errors to user-safe messages.
- Provide a consistent `ApiClientError` contract for UI consumption.
- Expose common error codes used across apps.

## Key Exports

- `ApiClient` and `apiClient`
- `ApiClientError`, `ERROR_CODES`, and related types

Example:

```ts
import { apiClient } from "@repo/api-client";

const data = await apiClient.execute(() => studentService.getProfile(email));
```

## Development

```bash
npm run build
```

```bash
npm run dev
```

## Related Docs

- [CI/CD Pipeline](../../docs/cicd-pipeline.md)
