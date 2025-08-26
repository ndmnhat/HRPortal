# HR Portal

## Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport.js with JWT

### Frontend
- **Framework**: Next.js (React)
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form

## Project Structure

```
hr-portal/
├── backend/           # NestJS backend application
├── frontend/          # Next.js frontend application
├── docker/            # Docker configuration files
├── .env.example       # Environment variables template
├── docker-compose.yml # Docker Compose configuration
└── README.md          # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

### Running with Docker

```bash
docker-compose up
```

### Running without Docker

#### Backend
```bash
cd backend
npm run start:dev
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Development

- Backend API: http://localhost:3000
- Frontend: http://localhost:3001
- PostgreSQL: localhost:5432