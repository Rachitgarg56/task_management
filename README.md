# TaskFlow — Full-Stack Task Management System

A production-quality Task Management System built with Node.js/Express (backend) and Next.js (frontend).

---

Hosted URL: https://task-management-pied-alpha.vercel.app

## Tech Stack

**Backend**
- Node.js + Express.js + TypeScript
- MySQL + Prisma ORM
- JWT Authentication (Access + Refresh tokens)
- bcrypt password hashing
- Zod validation

**Frontend**
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Axios (with auto token refresh interceptor)
- React Hook Form + Zod
- React Hot Toast

---

## Project Structure

```
task-management/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/          # DB + env config
│       ├── controllers/     # Request handlers
│       ├── middlewares/     # Auth + validation + error
│       ├── routes/          # API routing
│       ├── services/        # Business logic
│       ├── types/           # TypeScript types
│       ├── utils/           # JWT, password, response helpers
│       ├── validators/      # Zod schemas
│       ├── app.ts
│       └── server.ts
└── frontend/
    └── src/
        ├── app/             # Next.js App Router pages
        │   ├── login/
        │   ├── register/
        │   └── dashboard/
        ├── components/      # UI components
        ├── hooks/           # useAuth, useTasks
        ├── lib/             # Token storage
        ├── services/        # API + auth + task services
        └── types/           # Shared TypeScript types
```

---

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

---

## Setup — Backend

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/task_management"
PORT=5000
NODE_ENV=development

JWT_ACCESS_SECRET=change_this_to_a_long_random_string
JWT_REFRESH_SECRET=change_this_to_another_long_random_string
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

### 3. Create MySQL database

```sql
CREATE DATABASE task_management;
```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the backend

```bash
npm run dev
```

Server starts at: `http://localhost:5000`
Health check: `http://localhost:5000/health`

---

## Setup — Frontend

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Start the frontend

```bash
npm run dev
```

App runs at: `http://localhost:3000`

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout |

### Tasks (all require Bearer token)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | Get tasks (paginated, filterable) |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/:id` | Get task by ID |
| PATCH | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |
| PATCH | `/api/v1/tasks/:id/toggle` | Toggle completion |

### Query Parameters for GET /tasks

```
page=1          # Page number (default: 1)
limit=10        # Items per page (default: 10, max: 100)
status=pending  # Filter: pending | completed
search=meeting  # Search by title
```

---

## Security

- Passwords hashed with bcrypt (12 rounds)
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days and are stored in DB
- Users can only access their own tasks (enforced at service layer)
- All inputs validated with Zod
- CORS configured for frontend URL only

---

## Development Notes

- Backend uses `ts-node-dev` for hot reloading
- Frontend uses Next.js App Router with client components for interactive pages
- Axios interceptor automatically refreshes expired access tokens
- Token storage uses `localStorage` (suitable for development; consider httpOnly cookies for production hardening)
