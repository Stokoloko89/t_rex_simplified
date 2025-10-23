# T-Rex Microfrontend Application

A cost-effective, scalable microfrontend application built with React, Spring Boot, and Single-SPA for vehicle buying/selling workflows.

## 🏗️ Architecture

This application follows a **backend-driven workflow orchestration** pattern with:

- **Frontend**: React 18 microfrontends with Material-UI v7
- **Backend**: Spring Boot 3.1 with PostgreSQL 15
- **Orchestration**: Single-SPA for microfrontend management
- **Deployment**: Docker containers with multi-stage builds
- **State Management**: Backend-driven workflow engine with persistent state
- **API**: RESTful endpoints with comprehensive vehicle search and filtering

### Technology Stack

#### Frontend
- **React 18.3** - UI library with hooks and concurrent features
- **Material-UI 7.3** - Modern component library with CSS Grid layouts
- **Single-SPA 6.0** - Microfrontend orchestration framework
- **TypeScript 5.x** - Type-safe JavaScript
- **Webpack 5** - Module bundler with code splitting
- **pnpm 8.x** - Fast, disk space efficient package manager

#### Backend
- **Spring Boot 3.1** - Java application framework
- **Spring Data JPA** - Database abstraction layer
- **PostgreSQL 15** - Relational database
- **Hibernate** - ORM with query optimization
- **Maven 3.8** - Build and dependency management
- **Resilience4j** - Circuit breaker and fault tolerance

#### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **Multi-stage builds** - Optimized Docker images

## 📁 Project Structure

```
t_rex_simplified/
├── packages/
│   └── shared-ui/              # Shared UI component library
├── microfrontends/
│   └── buying-flow/            # Buying workflow microfrontend
├── host-app/                   # Single-SPA root config
├── backend/
│   └── workflowservice/        # Spring Boot workflow engine
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── docker-compose.yml          # Docker orchestration
├── PNPM_GUIDE.md              # Detailed pnpm usage guide
└── README.md
```

### 🏗️ Monorepo with pnpm Workspaces

This project uses **pnpm workspaces** for efficient monorepo management:

- **Faster installs**: Shared dependencies across workspaces
- **Disk space savings**: Hard links prevent duplication
- **Strict dependencies**: Prevents phantom dependency issues
- **Workspace filtering**: Run commands on specific packages

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+ (recommended package manager)
- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- PostgreSQL (if running locally)

#### Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Or using corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# Or using standalone script
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

> 📖 **For detailed pnpm usage and best practices, see [PNPM_GUIDE.md](./PNPM_GUIDE.md)**

### 1. Install Dependencies

```bash
# Install all dependencies (root and workspaces)
pnpm install

# Or use the convenience script
pnpm run install:all
```

### 2. Start with Docker (Recommended)

#### Option A: Backend Only (For Frontend Development)

```bash
# Start database and backend API
docker-compose up -d db workflowservice

# Check backend health
curl http://localhost:8080/actuator/health

# View backend logs
docker-compose logs -f workflowservice
```

This is the **recommended approach** for frontend development as it:
- Starts only the backend services you need
- Allows you to run frontend locally with hot reload
- Provides faster iteration cycles
- Uses less system resources

#### Option B: Full Stack with Docker

```bash
# Start all services (database, backend, and frontend)
docker-compose up --build

# Or start in detached mode
docker-compose up -d --build

# Stop all services
docker-compose down

# Rebuild and restart specific service
docker-compose up --build -d workflowservice
```

#### Docker Services

Services will be available at:
- **Workflow API**: http://localhost:8080
  - Health: http://localhost:8080/actuator/health
  - API Docs: http://localhost:8080/api/vehicles/filters
- **PostgreSQL**: localhost:5432
  - Database: `t_rex_db`
  - User: `t_rex_user`
  - Password: `password`
- **Host Application** (if running full stack): http://localhost:3000
- **Buying Flow** (if running full stack): http://localhost:3001

#### Docker Commands Reference

```bash
# View all running containers
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f workflowservice
docker-compose logs -f db

# Restart a service
docker-compose restart workflowservice

# Rebuild backend after code changes
docker-compose up --build -d workflowservice

# Stop all services
docker-compose down

# Stop and remove volumes (fresh database)
docker-compose down -v

# Execute commands in running container
docker-compose exec workflowservice sh
docker-compose exec db psql -U t_rex_user -d t_rex_db
```

### 3. Local Development (Without Docker)

#### Backend (Spring Boot)

```bash
cd backend/workflowservice
./mvnw spring-boot:run
```

#### Frontend

```bash
# Start shared UI library (development mode)
pnpm run start:shared

# Start buying flow microfrontend
cd microfrontends/buying-flow
pnpm start

# Start host application
cd host-app
pnpm start

# Or start all frontend services at once
pnpm run dev
```

## 🔧 pnpm Workspace Commands

```bash
# Install dependency in specific workspace
pnpm --filter buying-flow add axios
pnpm --filter shared-ui add -D @types/react

# Run commands in specific workspaces
pnpm --filter host-app build
pnpm --filter "microfrontends/*" test

# Run commands in all workspaces
pnpm -r build    # Build all packages
pnpm -r test     # Test all packages
pnpm -r clean    # Clean all packages

# Workspace filtering patterns
pnpm --filter "./packages/*" build     # All packages
pnpm --filter "*flow*" start          # Packages matching pattern
pnpm --filter "!host-app" build       # Exclude specific package
```

## 🔌 API Endpoints

### Vehicle Search & Filters

The backend provides comprehensive vehicle search and filtering capabilities:

```bash
# Get all available filters (makes, models, provinces, etc.)
GET /api/vehicles/filters

# Get all vehicle models (fixed in latest version)
GET /api/vehicles/models

# Get models for a specific make
GET /api/vehicles/makes/{make}/models

# Get all makes
GET /api/vehicles/makes

# Search vehicles with filters
GET /api/vehicles/search?make=Toyota&model=Corolla&minYear=2020&maxYear=2024

# Get filtered body types based on make/model selection
GET /api/vehicles/filtered/body-types?make=Toyota&model=Corolla

# Get dynamic price/year/mileage ranges based on current filters
GET /api/vehicles/filtered/ranges?make=Toyota&model=Corolla
```

### Recent Bug Fixes

**Issue**: `/api/vehicles/models` endpoint was returning 400 Bad Request

**Root Cause**: Spring Boot 3.x path mapping conflict between:
- `@GetMapping("/models")` - Get all models
- `@GetMapping("/models/{model}/make")` - Get make by model

**Solution**: Reordered endpoint definitions and added explicit `produces = "application/json"` to help Spring's path matcher distinguish between the two endpoints.

**Frontend Resilience**: Added multi-level fallback strategy:
1. Try `/api/vehicles/models` endpoint
2. Fallback to `filters.models` if available
3. Aggregate models by fetching from each make via `/makes/{make}/models`

This ensures the Model autocomplete always has data even if the primary endpoint fails.

## 🔧 Development Workflow

### Adding New Steps

1. **Frontend**: Create new step component in `microfrontends/buying-flow/src/steps/`
2. **Backend**: Add step logic to `BuyingWorkflowDefinition.java`
3. **Register**: Update `StepRenderer.tsx` component mapping

### Creating New Microfrontends

1. Create new directory in `microfrontends/`
2. Set up Single-SPA lifecycle
3. Register in `host-app/src/t-rex-root-config.js`
4. Add to pnpm workspace in `pnpm-workspace.yaml`

### Backend Services

The workflow engine supports:
- **Dynamic step navigation**
- **State persistence**
- **Validation rules**
- **Error handling**
- **Circuit breakers**

## 🧪 Testing

```bash
# Run all tests across workspaces
pnpm test

# Run frontend tests for specific package
pnpm --filter buying-flow test

# Run backend tests
cd backend/workflowservice
./mvnw test

# Run integration tests
docker-compose -f docker-compose.test.yml up --build
```

## 📦 Building for Production

```bash
# Build all components
pnpm run build:all

# Build specific components
pnpm run build:host
pnpm run build:shared

# Build Docker images
docker-compose build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

## 🔌 Integration into Third-Party Websites

To embed the microfrontend into any website:

```html
<!DOCTYPE html>
<html>
<head>
    <script type="systemjs-importmap">
    {
      "imports": {
        "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@6.0.0/lib/system/single-spa.min.js",
        "@t-rex/buying-flow": "https://your-cdn.com/buying-flow.js"
      }
    }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.0/dist/system.min.js"></script>
</head>
<body>
    <div id="t-rex-container"></div>
    <script src="https://your-cdn.com/t-rex-root-config.js"></script>
</body>
</html>
```

## 🛠️ Configuration

### Environment Variables

#### Frontend
- `REACT_APP_BACKEND_API_URL`: Backend API URL (default: http://localhost:8080/api)

#### Backend
- `SPRING_DATASOURCE_URL`: PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

### Docker Environment

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up
```

## 🔒 Security Features

- **CORS configuration** for cross-origin requests
- **Input validation** on all API endpoints
- **SQL injection protection** via JPA
- **XSS protection** headers
- **Content Security Policy**

## 📊 Monitoring

- **Health checks** for all services
- **Actuator endpoints** for Spring Boot
- **Application metrics** via Micrometer
- **Logging** with structured format

## 🚀 Deployment Options

### Cloud Platforms
- **AWS ECS/EKS**
- **Google Cloud Run/GKE**
- **Azure Container Instances/AKS**
- **DigitalOcean App Platform**

### Static Hosting (Frontend)
- **Vercel**
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Port conflicts**: Change ports in docker-compose.yml or package.json scripts

**Database connection**: Ensure PostgreSQL is running and credentials are correct

**CORS errors**: Check CORS configuration in WorkflowController.java

**Build failures**: Clear node_modules and reinstall dependencies
```bash
# Clean and reinstall with pnpm
pnpm -r clean && rm -rf node_modules
pnpm install
```

**pnpm cache issues**: Clear pnpm store if experiencing dependency issues
```bash
pnpm store prune
```

**Workspace dependency issues**: Ensure proper workspace references in package.json

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f workflowservice
docker-compose logs -f buying-flow
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with detailed information

---

Built with ❤️ using modern web technologies for scalable microfrontend architecture.
