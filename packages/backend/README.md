# @repo/backend

## Introduction

The `@repo/backend` package is the shared **domain and service layer** for the University-SSO monorepo. It centralizes business logic, repositories, DTOs, and service interfaces so the portals can call a consistent API without duplicating data access or validation rules.

It is framework-agnostic at the service level, but integrates with Prisma for persistence and includes WSO2 Identity Server integration for staff/user lifecycle flows.

## Installation

This package is part of a monorepo workspace and is not intended to be published to a public registry. It is consumed by other packages/apps in the workspace.

To include it in a workspace application, ensure it is listed in the `dependencies` of the consuming `package.json`:

```json
{
  "dependencies": {
    "@repo/backend": "*"
  }
}
```

## Architecture

The backend follows a layered architecture to separate concerns:

1.  **Modules**: Domain-focused modules (academics, admin, book, dashboard, identity, lending, student).
2.  **Services**: Business logic and orchestration. Services call repositories and external APIs.
3.  **Repositories**: Prisma-based data access.
4.  **DTOs**: Data Transfer Objects for inputs/outputs.
5.  **Interfaces**: Contracts for service behavior.

### Directory Structure

```
src/
├── common/         # Shared utilities, base services, and errors
├── errors/         # Domain and repository error types
├── lib/            # Database and shared helpers
├── modules/        # Domain-specific modules
│   ├── academics/  # Academic domain (org/program/course/offering)
│   ├── admin/      # Admin & staff management
│   ├── book/       # Book catalog and inventory
│   ├── dashboard/  # Dashboard aggregation (student/admin)
│   ├── identity/   # WSO2 IS integration (SCIM2 + internal APIs)
│   ├── lending/    # Borrow/return workflows
│   └── student/    # Student profile and enrollment
└── index.ts        # Main entry point exporting public API
```

## Modules

### Academics Module
Academic domain services for organizations, programs, courses, and offerings.
*   **Service**: `AcademicsService`
*   **Supporting services**: `OrganizationService`, `ProgramService`, `CourseService`, `OfferingService`

### Admin Module
Admin and staff profile management, including WSO2 user provisioning and invitations.
*   **Service**: `AdminService`

### Book Module
Book catalog and inventory management.
*   **Service**: `BookService`
*   **Repository**: `BookRepository`

### Dashboard Module
Aggregates data for student and admin dashboards.
*   **Service**: `DashboardService`, `AdminDashboardService`

### Identity Module
WSO2 IS integration via SCIM2 and internal APIs (user creation, group assignment, invites).
*   **Service**: `IdentityService`

### Lending Module
Borrowing and returning lifecycle for books.
*   **Service**: `LendingService`

### Student Module
Student profiles and enrollment operations.
*   **Service**: `StudentService`
*   **Repository**: `StudentRepository`

## Usage Examples

### Initializing a Service

Services are typically instantiated with their dependencies.

```typescript
import { StudentService } from '@repo/backend';

// The service handles its own repository instantiation internally or via DI
const studentService = new StudentService();

async function getStudentProfile(email: string) {
  try {
    const profile = await studentService.getProfileByEmail(email);
    console.log(profile);
  } catch (error) {
    console.error("Failed to fetch profile", error);
  }
}
```

### Handling Errors

The package uses a custom `AppError` class for controlled error handling.

```typescript
import { AppError } from '@repo/backend';

try {
  // ... operation
} catch (error) {
  if (error instanceof AppError) {
    // Handle known application error (e.g., Validation, Not Found)
  } else {
    // Handle unexpected system error
  }
}
```

## Development

### commands

*   `npm run build`: Compiles the TypeScript code.
*   `npm run dev`: Runs the compiler in watch mode.

### Adding a New Module

1.  Create a folder in `src/modules/<module-name>`.
2.  Create `<module>.interface.ts` to define the API.
3.  Create `<module>.repository.ts` for data access.
4.  Create `<module>.service.ts` implementing the interface.
5.  Export everything in `src/index.ts`.

## Related Docs

- [WSO2 Configuration](../../docs/wso2-configuration.md)
- [CI/CD Pipeline](../../docs/cicd-pipeline.md)
