# @repo/auth

## Overview

Shared NextAuth configuration for the portals, using WSO2 Identity Server (OIDC) as the identity provider. Exposes handlers and helpers that apps can reuse.

## Responsibilities

- Configure NextAuth with WSO2 IS OIDC settings.
- Map WSO2 roles/groups claims into application roles.
- Validate users against the database during sign-in.

## Key Exports

- `handlers`, `signIn`, `signOut`, `auth` from NextAuth configuration.

## Configuration

Environment variables expected by this package:

- `WSO2_CLIENT_ID`
- `WSO2_CLIENT_SECRET`
- `WSO2_ISSUER`
- `WSO2_WELL_KNOWN`

## Development Notes

This package relies on `@repo/database` for user lookup and `@repo/logger` for logging.

## Related Docs

- [WSO2 Configuration](../../docs/wso2-configuration.md)
