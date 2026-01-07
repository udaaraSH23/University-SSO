# Book Module Error Handling

This document outlines the error handling strategy for the Book module, detailing how errors are propagated and handled across different layers.

## Repository Layer (`BookRepository`)

The repository layer is responsible for direct database interactions using Prisma. It focuses on data retrieval and does not implement business logic validation.

### `searchBooks`
- **Functionality**: Searches for books based on a query string (title, author, ISBN) with pagination.
- **Errors**:
  - No specific errors

### `findBookById`
- **Functionality**: Retrieves a single book record by its numeric ID.
- **Errors**:
  - No specific errors

---

## Service Layer (`BookReader` & `BookManager`)

The service layer implements business logic and orchestrates data retrieval. It is responsible for validating inputs and converting low-level errors into domain-specific errors.

### `BookReader`

#### `getBookDetails`
- **Functionality**: Retrieves detailed book information.
- **Errors**:
  - Invalid book ID format - DomainError (`VALIDATION_ERROR`, 400)
  - Book not found - DomainError (`BOOK_NOT_FOUND`, 404)
  - Failed to get book details - AppError (500)

#### `searchBooks`
- **Functionality**: Searches for books and transforms the result into a specific response format.
- **Errors**:
  - Failed to search books - AppError (500)

### `BookManager`

#### `createBook`
- **Functionality**: Creates a new book record.
- **Errors**:
  - Failed to create book - AppError (500)

#### `updateBook`
- **Functionality**: Updates an existing book record.
- **Errors**:
  - Failed to update book - AppError (500)

#### `deleteBook`
- **Functionality**: Deletes a book record.
- **Errors**:
  - Failed to delete book - AppError (500)

#### `getBookById` (Admin)
- **Functionality**: Helper to get raw book model.
- **Errors**:
  - Failed to get book by id - AppError (500)
