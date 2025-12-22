# Error Handling & Logging Template

This template provides a **boilerplate for custom exceptions, structured logging, and error handling** in your project. Developers should follow this for consistent and clear error management.

---

## 1. Custom Exception Classes
```ts
// Base error class
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Example specific errors
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}

class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}
```

---

## 2. Centralized Error Handling Middleware
```ts
import { Request, Response, NextFunction } from "express";

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    context: req.path,
    userId: req.user?.id,
    requestId: req.id
  });

  res.status(err.statusCode || 500).json({
    error: err.message,
  });
});
```

---

## 3. Logging Guidelines
- Use **structured logging** (JSON).  
- Include: `timestamp`, `level`, `module`, `message`, `context`, `userId`, `requestId`, `stack`.  
- Mask sensitive data (passwords, tokens).  
- Log at appropriate **levels**: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`.

**Example:**
```ts
logger.error({
  timestamp: new Date().toISOString(),
  level: "ERROR",
  module: "RoleMiddleware",
  message: "User role mismatch",
  userId: req.user?.id,
  requestId: req.id,
  stack: err.stack
});
```

---

## 4. Developer Guidelines
1. Think of **edge cases** and implement proper error handling.  
2. Use custom exception classes to categorize errors.  
3. Always log errors with relevant context.  
4. Write **unit/integration tests** for error flows.  
5. Do not create backlog items for **expected errors**; only track unexpected/unhandled errors.  
6. QA should verify that all error flows behave correctly and logs are generated as expected.

---

## 5. Optional Templates
- `error-handling.md` – project documentation explaining error types and logging rules.  
- `error-log.json` – example structured log entry for reference.  
- `bug-report-template.md` – for capturing unhandled/critical errors detected during QA.

---

**End of Template**

