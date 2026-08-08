# Student MS &middot; Frontend

React + Vite single-page app for the Student Management System backend.

## How it fits together

- `npm run build` compiles this app straight into
  `../src/main/resources/static`, so the Spring Boot backend serves it
  directly. One jar, one process, no CORS to configure.
- The built `static/` folder is already committed/included in this project,
  so you can run the backend alone (`./mvnw spring-boot:run`) without ever
  touching Node - the compiled frontend is already sitting there.
- If you want to *change* the frontend, edit the files in `src/`, then
  re-run `npm run build` to regenerate `static/`.

## Local development

```bash
npm install
npm run dev
```

This starts Vite's dev server (with hot reload) on its own port and proxies
any `/api/**` request to `http://localhost:8080` - so run the Spring Boot
backend separately while developing (`./mvnw spring-boot:run` in the
`student-ms` folder) and edit the frontend with instant feedback.

## Rebuilding for production

```bash
npm run build
```

Outputs into `../src/main/resources/static`, overwriting the previous build.
Commit the result if you want the backend to always have the latest frontend
baked in.

## Structure

```
src/
  api/client.js            fetch wrapper - attaches the JWT, parses backend errors
  context/AuthContext.jsx  login/logout state, session storage
  context/ToastContext.jsx toast notifications
  components/              Sidebar, Modal, StudentTable, form modals, etc.
  pages/                   LoginPage, StudentsPage, SearchPage, ProjectsPage
  styles/index.css         design tokens + all component/page styles
```

Auth: `POST /api/v1/auth/login` returns a JWT, stored in `sessionStorage` and
sent as `Authorization: Bearer <token>` on every subsequent request. A 401
anywhere logs the user out automatically.
