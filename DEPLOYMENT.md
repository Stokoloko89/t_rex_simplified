# T-Rex Microfrontend Deployment Guide

This guide covers different deployment strategies for the T-Rex microfrontend application.

## 🚀 Quick Deployment

### Development Environment

```bash
# Clone the repository
git clone <repository-url>

# Start development environment
./start-dev.sh
```

### Production Environment

```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d

# Or build and start
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🐳 Docker Deployment

### Local Development

```bash
# Start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

```bash
# Set environment variables
export DB_PASSWORD=your_secure_password
export BACKEND_URL=https://your-domain.com/api

# Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Monitor
docker-compose -f docker-compose.prod.yml logs -f
```

## ☁️ Cloud Deployment

### AWS ECS/Fargate

1. **Build and push images to ECR**:
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag images
docker build -t t-rex/workflowservice ./backend/workflowservice
docker tag t-rex/workflowservice:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/t-rex/workflowservice:latest

# Push images
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/t-rex/workflowservice:latest
```

2. **Create ECS task definitions** for each service
3. **Set up Application Load Balancer**
4. **Configure RDS PostgreSQL instance**
5. **Deploy using ECS service**

### Google Cloud Run

```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT-ID/workflowservice ./backend/workflowservice
gcloud run deploy workflowservice --image gcr.io/PROJECT-ID/workflowservice --platform managed

# Build and deploy frontend
gcloud builds submit --tag gcr.io/PROJECT-ID/host-app ./host-app
gcloud run deploy host-app --image gcr.io/PROJECT-ID/host-app --platform managed
```

### Azure Container Instances

```bash
# Create resource group
az group create --name t-rex-rg --location eastus

# Deploy containers
az container create \
  --resource-group t-rex-rg \
  --name t-rex-backend \
  --image your-registry/workflowservice:latest \
  --ports 8080
```

## 🌐 Static Hosting (Frontend Only)

### Vercel

1. **Build the applications**:
```bash
# Build all applications
pnpm run build:all

# Or build individually
cd host-app && pnpm run build
cd ../microfrontends/buying-flow && pnpm run build
```

2. **Deploy to Vercel**:
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy host app
cd host-app && vercel --prod

# Deploy buying flow
cd ../microfrontends/buying-flow && vercel --prod
```

### Netlify

```bash
# Build applications
pnpm run build:all

# Deploy using Netlify CLI
pnpm add -g netlify-cli
cd host-app && netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

```bash
# Build applications
pnpm run build:all

# Upload to S3
aws s3 sync host-app/dist s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🗄️ Database Setup

### PostgreSQL on Cloud

#### AWS RDS
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier t-rex-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username t_rex_user \
  --master-user-password your_password \
  --allocated-storage 20
```

#### Google Cloud SQL
```bash
# Create Cloud SQL instance
gcloud sql instances create t-rex-db \
  --database-version=POSTGRES_13 \
  --tier=db-f1-micro \
  --region=us-central1
```

### Local PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE t_rex_db;
CREATE USER t_rex_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE t_rex_db TO t_rex_user;
```

## 🔧 Configuration

### Environment Variables

#### Backend (Spring Boot)
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/t_rex_db
SPRING_DATASOURCE_USERNAME=t_rex_user
SPRING_DATASOURCE_PASSWORD=password
SPRING_PROFILES_ACTIVE=production
```

#### Frontend (React)
```bash
REACT_APP_BACKEND_API_URL=https://api.your-domain.com
```

### SSL/TLS Configuration

1. **Obtain SSL certificates** (Let's Encrypt, AWS Certificate Manager, etc.)
2. **Update nginx configuration**:
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    # ... rest of configuration
}
```

## 📊 Monitoring & Logging

### Application Monitoring

```bash
# View application logs
docker-compose logs -f workflowservice

# Monitor resource usage
docker stats

# Health checks
curl http://localhost:8080/actuator/health
curl http://localhost:3000/health
```

### Production Monitoring

- **Prometheus + Grafana** for metrics
- **ELK Stack** for centralized logging
- **Sentry** for error tracking
- **New Relic/Datadog** for APM

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy T-Rex Application

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build and deploy
        run: |
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml up -d
```

### GitLab CI Example

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE/workflowservice ./backend/workflowservice
    - docker push $CI_REGISTRY_IMAGE/workflowservice

deploy:
  stage: deploy
  script:
    - docker-compose -f docker-compose.prod.yml up -d
```

## 🛡️ Security Considerations

### Production Checklist

- [ ] Use HTTPS/TLS encryption
- [ ] Set strong database passwords
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up Web Application Firewall (WAF)
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Backup strategies

### Environment Security

```bash
# Use secrets management
export DB_PASSWORD=$(aws secretsmanager get-secret-value --secret-id prod/db/password --query SecretString --output text)

# Restrict network access
# Configure security groups/firewall rules
```

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check connection string and credentials
3. **CORS errors**: Verify CORS configuration in backend
4. **Build failures**: Clear caches and reinstall dependencies

### Debug Commands

```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs service-name

# Execute commands in container
docker-compose exec workflowservice bash

# Test connectivity
curl -f http://localhost:8080/actuator/health
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  workflowservice:
    deploy:
      replicas: 3
    # ... rest of configuration
```

### Load Balancing

- Use nginx upstream for multiple backend instances
- Configure session affinity if needed
- Implement health checks

### Database Scaling

- Read replicas for read-heavy workloads
- Connection pooling
- Database sharding for large datasets

---

For more detailed information, refer to the main README.md file.
