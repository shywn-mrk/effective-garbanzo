## Project Overview

This project is a NestJS-based RESTful API for managing products and user authentication in an online store. The system includes endpoints for product management (create, purchase, display, delete) and user registration/login with JWT authentication. The application is containerized using Docker and provides Swagger documentation for easy API exploration.

---

## Project Structure

```
src/
├── app.module.ts          # Main module
├── app.controller.ts      # Base application controller
├── product/               # Product module
│   ├── product.controller.ts # Product endpoints
│   ├── product.service.ts    # Product business logic
│   ├── product.entity.ts     # Product entity definition
│   └── product.module.ts     # Product module configuration
├── user/                  # User module
│   ├── user.controller.ts    # User authentication endpoints
│   ├── user.service.ts       # User business logic
│   ├── user.entity.ts        # User entity definition
│   ├── auth.service.ts       # Authentication logic (JWT handling)
│   └── user.module.ts        # User module configuration
└── main.ts                # Application entry point
```

---

## Features

- **Product Management**:
  - Create a product
  - Purchase a product
  - List/display products
  - Delete a product
- **User Management**:
  - Register a user
  - Login a user (with JWT authentication)
- **Swagger Documentation**:
  - Interactive API documentation available at `/api/docs`
- **Database**:
  - SQLite database configured via TypeORM
- **JWT Authentication**:
  - Secures endpoints with role-based access.

---

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed.
- Node.js and npm installed (if running locally without Docker).

---

### Running the Project

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

   This will start the application, database, and all required services.

3. **Run Locally (Without Docker)**:
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the application:
     ```bash
     npm run start:dev
     ```

4. **Database Migrations**:
   Migrations are handled automatically using TypeORM with `synchronize: true`. 

---

### Swagger API Documentation

The Swagger documentation is available after running the application. It provides a user-friendly interface to interact with the API.

1. Access the Swagger UI at:
   ```
   http://localhost:3000/api/docs
   ```

2. Use the **"Authorize"** button to input a valid JWT token to test protected endpoints.

---

### Using the API

#### 1. Register a User
- **Endpoint**: `POST /users/register`
- **Payload**:
  ```json
  {
    "username": "example",
    "password": "password123"
  }
  ```

#### 2. Login
- **Endpoint**: `POST /users/login`
- **Payload**:
  ```json
  {
    "username": "example",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "your_jwt_token"
  }
  ```

#### 3. Access Protected Endpoints
- Use the JWT token from the `/login` response in the `Authorization` header:
  ```
  Authorization: Bearer <your_jwt_token>
  ```

---

### Running Tests

Run all unit tests using:
```bash
npm test
```

---

Feel free to explore and modify the project as per your requirements!