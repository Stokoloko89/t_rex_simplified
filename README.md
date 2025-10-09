# T-Rex Microfrontend Application

A cost-effective, scalable microfrontend application built with React, Spring Boot, and Single-SPA for vehicle buying/selling workflows.

## 🏗️ Architecture

This application follows a **backend-driven workflow orchestration** pattern with:

- **Frontend**: React microfrontends with Material UI
- **Backend**: Spring Boot microservices with PostgreSQL
- **Orchestration**: Single-SPA for microfrontend management
- **Deployment**: Docker containers with nginx

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

```bash
# Start all services
docker-compose up --build

# Or start in detached mode
docker-compose up -d --build
```

Services will be available at:
- **Host Application**: http://localhost:3000
- **Buying Flow**: http://localhost:3001
- **Workflow API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

### 3. Local Development

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
