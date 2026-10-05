# Student Management System

A full-stack Student Management System built with **Spring Boot**, **Spring Data JPA**, **Spring Security/JWT**, **H2/MySQL**, and a **React + Vite** frontend. The project provides authentication, student CRUD operations, search, and student project management.

## Live Demo

**Live Demo (Render):** https://student-management-system-snb3.onrender.com/students

**Application URL:** https://student-management-system-snb3.onrender.com

> The hosted service may take a short time to wake up after a period of inactivity on Render's free tier.

## Features

- JWT-based login and registration
- Student create, read, update, and delete operations
- Search students by ID, email, index number, and date-of-birth range
- Student project management
- Form validation and API error handling
- React single-page interface with protected routes
- H2 in-memory database for zero-setup local demonstration
- MySQL configuration support for deployment
- Swagger/OpenAPI support
- Automated unit tests for service/controller logic

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.0.1
- Spring Web
- Spring Data JPA
- Spring Security
- JWT (JJWT)
- H2 / MySQL
- Maven
- Springdoc OpenAPI

### Frontend
- React 19
- Vite
- React Router
- Lucide React

## Repository Structure

```text
student-management-system/
├── frontend/                 # React + Vite source
├── src/main/java/            # Spring Boot backend
├── src/main/resources/       # Backend configuration, database scripts and static build
├── src/test/                 # Backend tests
├── pom.xml
├── mvnw / mvnw.cmd
└── README.md
```

## Run Locally

### 1. Start the backend

Java 17+ is required. From the repository root:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell/CMD:

```bat
mvnw.cmd spring-boot:run
```

The backend runs on `http://localhost:8080`. The committed demo configuration uses an in-memory H2 database, so no external database is required.

### 2. Open the application

Open:

```text
http://localhost:8080
```

### 3. Demo login

```text
Username: crni99
Password: student
```

You can also create a new account through the Sign Up page.

### 4. Frontend development mode (optional)

```bash
cd frontend
npm install
npm run dev
```

The Vite development server uses the backend API while the Spring Boot application is running separately.

### 5. Build the frontend

```bash
cd frontend
npm install
npm run build
```

The production build is generated into `src/main/resources/static/` so the Spring Boot application can serve the frontend.

## Production Configuration

The public `src/main/resources/application.properties` contains only safe demo defaults. **Do not put production passwords, database credentials, API keys, or real JWT secrets in GitHub.**

For a deployed environment such as Render, provide values through environment variables, for example:

```text
JWT_SECRET=<strong-random-secret>
JWT_EXPIRATION_MS=86400000
ADMIN_USERNAME=<your-admin-username>
ADMIN_PASSWORD=<your-admin-password>
SPRING_DATASOURCE_URL=<your-database-url>
SPRING_DATASOURCE_USERNAME=<your-database-user>
SPRING_DATASOURCE_PASSWORD=<your-database-password>
```

The production environment can therefore use a real MySQL database without exposing its credentials in this repository.

## API

Authentication endpoints:

```text
POST /api/v1/auth/login
POST /api/v1/auth/register
```

Student/project APIs are available under:

```text
/api/v1/student-ms/**
```

Swagger UI is available at `/swagger-ui/index.html` when the backend is running.

## Attribution

The backend started from the open-source project [crni99/Student-Management-System](https://github.com/crni99/Student-Management-System) (Spring Boot + H2 student CRUD, custom exceptions, service/controller tests). That repository does not publish a license file, so its code is credited here and is not claimed as original.

**Added/changed in this project:** the complete React + Vite frontend, JWT authentication (login/signup, BCrypt-hashed users), Spring Security configuration, SPA routing, project management for students, search UI, and Render deployment.
