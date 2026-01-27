# @repo/ui

## Overview

Shared UI components and layout primitives for the student, library, admin, and login portals. Includes auth buttons, layout shells, tables, modals, and Storybook stories.

## Responsibilities

- Provide reusable React components for portals.
- Centralize layout building blocks (sidebar, headers, shells).
- Maintain Storybook for component development.

## Key Exports

Examples include:

- `LoginButton`, `LogoutButton`, `RoleRedirectCard`, `AuthErrorCard`
- `ThemeProvider`, `ThemeToggle`, `Toaster`
- `Pagination`, `DataTable`, `Modal`, `SlideOver`
- Layout components like `DashboardShell`, `Sidebar`, `PortalSidebar`

## Development

```bash
npm run storybook
```

```bash
npm run build-storybook
```

## Related Docs

- [TLS Configuration](../../docs/tls-configuration.md)
- [CI/CD Pipeline](../../docs/cicd-pipeline.md)
