# @repo/backend

## Introduction

The `@repo/backend` package serves as the core business logic layer for the University Portal application. It encapsulates the service layer, data access patterns (repositories), and domain interfaces, providing a centralized and consistent API for consuming applications like the Student Portal and Library Portal.

This package is designed to be framework-agnostic where possible, though it currently integrates closely with Next.js server actions and Prisma for database access.

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

1.  **Modules**: Logic is organized by domain modules (e.g., `Student`, `Book`, `Admin`).
2.  **Services**: Contain business logic and orchestration. Services interact with Repositories.
3.  **Repositories**: Handle direct database interactions using Prisma.
4.  **DTOs (Data Transfer Objects)**: Define the shape of data moving in and out of the services.
5.  **Interfaces**: Define contracts for services to ensure loose coupling and easier testing.

### Directory Structure

```
src/
├── common/         # Shared utilities and error classes
├── models/         # (Optional) Domain models if strictly separated
├── modules/        # Domain-specific modules
│   ├── admin/      # Admin module
│   ├── book/       # Book management module
│   ├── dashboard/  # Dashboard aggregation module
│   ├── lending/    # Book lending module
│   └── student/    # Student profile module
└── index.ts        # Main entry point exporting public API
```

## Modules

### Student Module
Manages student profiles, enrollment data, and student-specific operations.
*   **Service**: `StudentService`
*   **Repository**: `StudentRepository`

### Book Module
Handles book inventory, cataloging, and details.
*   **Service**: `BookService`
*   **Repository**: `BookRepository`

### Lending Module
Manages the borrowing and returning lifecycle of books.
*   **Service**: `LendingService`

### Dashboard Module
Aggregates data for frontend dashboards (e.g., student summary, recent activities).
*   **Service**: `DashboardService`

### Admin Module
Handles administrative tasks and staff profile management.
*   **Service**: `AdminService`

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
