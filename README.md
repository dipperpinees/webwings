# WebWings Apps

This directory contains all the applications that make up the WebWings project. The project follows a monorepo structure using Turborepo.

## Project Structure

```
apps/
├── api/          # Go-based API service
├── web/          # Frontend web application
├── deployment/   # Deployment service
└── monitoring/   # Monitoring and observability service
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Go 1.21 or higher
- Docker and Docker Compose (for containerized deployment)
- npm (package manager)

### Installation

1. Install dependencies at the root:
```bash
npm install
```

2. Install Go dependencies for the API:
```bash
cd apps/api
go mod tidy
```

### Development

To start the development environment:

```bash
# From the root directory
npm run dev
```

This will start all services in development mode using Turborepo's watch mode.

### Building

To build all applications:

```bash
npm run build
```

### Production Deployment

For production deployment, use Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Project Configuration

### Turborepo Setup

The project uses Turborepo for managing the monorepo. The configuration is defined in `turbo.json` with the following main tasks:

#### Development Tasks
- `dev`: Development mode with watch functionality
- `build`: Production build with dependency management
- `start`: Production mode startup

#### Database Tasks
- `db:migrate`: Database migration execution
- `db:seed`: Database seeding

#### Utility Tasks
- `generate`: Code generation (e.g., API clients)
- `install:api`: Go dependencies installation

### Environment Variables

The project requires various environment variables for different tasks. Here are the main categories:

#### Database Configuration
- `DB_PORT`
- `DB_HOST`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

#### API Configuration
- `API_URL`
- `PUBLIC_API_URL`
- `WEB_PORT`

#### Authentication
- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_SECRET_KEY`
- `GITHUB_OAUTH_REDIRECT_URL`
- `GOOGLE_CLIENT_ID`

#### Email Configuration
- `EMAIL`
- `EMAIL_PASSWORD`

#### Infrastructure
- `AMQP_URI`
- `REDIS_URL`
- `DOCKER_REGISTRY_USER`
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_API_KEY`
- `MAIN_DOMAIN`

### Package Management

The project uses npm workspaces for managing multiple packages. The root `package.json` defines:

- Workspace configuration: `"workspaces": ["apps/*"]`
- Package manager: `"packageManager": "^npm@10.2.3"`

## Available Scripts

- `npm run dev` - Start development environment
- `npm run build` - Build all applications
- `npm run start` - Start all applications in production mode
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run generate` - Generate necessary files (e.g., API clients)
- `npm run install:api` - Install Go dependencies for the API

## Docker Support

Each application can be containerized using the provided Dockerfiles in the `docker/apps` directory. The main Dockerfile for the entire project is located in the `docker` directory.

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in the required environment variables in `.env`

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

ISC