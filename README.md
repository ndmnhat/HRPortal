# HR Portal

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js with JWT
- **API Documentation**: Swagger/OpenAPI
- **Caching**: Redis

### Frontend
- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form
- **Icons**: Heroicons



## Quick Start (Using Docker) 🚀

The easiest way to get started is using Docker. This will set up everything automatically.

```bash
# 1. Clone the repository
git clone <repository-url>
cd HRPortal

# 2. Copy environment file
cp .env.example .env

# 3. Start everything with Docker
npm run docker:up

# That's it! The application is now running at:
# - Frontend: http://localhost:3001
# - Backend API: http://localhost:3000
# - API Docs: http://localhost:3000/api/docs
```

To stop the application:
```bash
npm run docker:down
```

## Manual Setup (Without Docker)

If you prefer to run the application without Docker, follow these steps:

### Prerequisites
- Node.js 18+
- Redis 7.4+
- PostgreSQL 14+
- npm 9+
- Java 11+

### Step 1: Clone and Setup Environment

```bash
# Clone repository
git clone <repository-url>
cd HRPortal

# Setup environment files
cp .env.example .env
cd frontend && cp .env.example .env.local && cd ..
```

### Step 2: Install Dependencies

```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 3: Start PostgreSQL

```bash
# Option A: Use Docker for PostgreSQL only
docker run --name hr-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=hr_portal \
  -p 5432:5432 \
  -d postgres:14

# Option B: Use existing PostgreSQL installation on port 5432
```

### Step 4: Run the Application

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run build
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run generate:frontend-api
npm run dev
```

## Testing

### Quick Test Run
```bash
cd backend
npm run test
```

### Detailed Testing
```bash
cd backend

# Create test database (first time only)
psql -U postgres -c "CREATE DATABASE hr_portal_test;"

# Run tests
npm run test                    # All tests
npm run test:watch         # Watch mode
npm run test:cov          # With coverage
npm run test:e2e          # E2E tests
```

## Project Structure

```
hr-portal/
├── backend/                # NestJS backend
│   ├── src/               # Source code
│   ├── test/              # Test files
│   └── dist/              # Build output
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   └── store/        # Redux store
│   └── public/           # Static assets
├── docker-compose.yml     # Docker configuration
├── .env.example          # Environment template
└── README.md             # This file
```

## Environment Variables

### Basic Setup (.env)

The default `.env.example` file contains everything you need. Just copy it:

```bash
cp .env.example .env
```

### Customization (Optional)

If you need to customize, here are the key variables:

**Backend (.env)**
```bash
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hr_portal

# Security
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Frontend (frontend/.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## CI/CD

### GitHub Actions

The project includes automated workflows for:
- Testing on push/PR
- Building Docker images
- Deployment

Workflows: `.github/workflows/`