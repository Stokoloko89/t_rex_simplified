# T-Rex Microfrontend Technical Details

## Comprehensive Technical Architecture

### 🏗️ System Architecture Overview

#### Backend-Driven Workflow Orchestration

The T-Rex application implements a **backend-driven workflow orchestration pattern** that provides several key advantages:

1. **Centralized Business Logic**: All workflow logic, validation rules, and state transitions are managed by the backend
2. **Security**: Sensitive business rules and data processing never exposed to the frontend
3. **Maintainability**: Single source of truth for workflow behavior
4. **Consistency**: Uniform experience across all frontend instances
5. **Scalability**: Backend and frontend scale independently

#### Architecture Pattern Benefits

| Aspect | Traditional Frontend-Driven | T-Rex Backend-Driven |
|--------|---------------------------|---------------------|
| **Security** | Business logic exposed | Server-side validation only |
| **Maintenance** | Changes require redeployment | Backend-only updates |
| **Consistency** | Varies by frontend instance | Uniform across all users |
| **Performance** | Heavy client-side processing | Optimized server processing |
| **Integration** | Complex state synchronization | Simple API contracts |

### 🔧 Technical Implementation Details

#### Backend Architecture (Spring Boot)

**Core Components:**

```java
// Workflow Engine - Central orchestration
@Component
public class WorkflowEngine {
    private final WorkflowDefinitionRegistry definitionRegistry;
    private final WorkflowStateRepository stateRepository;
    private final ValidationEngine validationEngine;
    private final TransitionEngine transitionEngine;
}

// Workflow Definition - Business logic container
@Component
public class BuyingWorkflowDefinition implements WorkflowDefinition {
    // Step definitions, transitions, validations
    private static final String VEHICLE_SEARCH = "vehicle-search";
    private static final String VEHICLE_DETAILS = "vehicle-details";
    private static final String PERSONAL_INFO = "personal-info";
    private static final String CONFIRMATION = "confirmation";
}

// State Management - Session persistence
@Entity
public class WorkflowState {
    @Id private String sessionId;
    private String workflowType;
    private String currentStep;
    private Map<String, Object> userData;
    private Map<String, Object> context;
    private WorkflowStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

**API Endpoints:**

```java
@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    @PostMapping("/start")
    public WorkflowTransitionResponse startWorkflow(@RequestBody StartWorkflowRequest request) {
        // Initialize new workflow session
        return workflowEngine.initializeWorkflow(request.getWorkflowType());
    }

    @PostMapping("/transition")
    public WorkflowTransitionResponse processTransition(@RequestBody TransitionRequest request) {
        // Process step transition with validation
        return workflowEngine.processTransition(request.getSessionId(),
                                               request.getCurrentStep(),
                                               request.getFormData());
    }

    @PostMapping("/back")
    public WorkflowTransitionResponse navigateBack(@RequestBody BackNavigationRequest request) {
        // Navigate to previous step
        return workflowEngine.navigateBack(request.getSessionId(),
                                          request.getCurrentStep());
    }
}
```

#### Frontend Architecture (React + TypeScript)

**Component Structure:**

```typescript
// App.tsx - Main application wrapper
const App: React.FC = () => {
    return (
        <ThemeProvider theme={tRexTheme}>
            <CssBaseline />
            <ErrorBoundary>
                <WorkflowProvider>
                    <StepRenderer />
                </WorkflowProvider>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

// WorkflowProvider.tsx - State management context
interface WorkflowContextType {
    currentStep: string;
    sessionId: string;
    isLoading: boolean;
    error: string | null;
    submitStep: (data: any) => Promise<void>;
    goBack: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType>({} as WorkflowContextType);

// StepRenderer.tsx - Dynamic component rendering
const StepRenderer: React.FC = () => {
    const { currentStep, stepConfig } = useWorkflow();

    const renderStepComponent = (stepId: string) => {
        const components: Record<string, React.ComponentType<any>> = {
            'intent-selection': IntentSelection,
            'vehicle-search': VehicleSearch,
            'vehicle-details': VehicleDetails,
            'personal-info': PersonalInfo,
            'confirmation': Confirmation,
            // Selling flow components
            'has-buyer': HasBuyer,
            'buyer-type': BuyerType,
            'dealer-network': DealerNetwork,
            'replacement-check': ReplacementCheck,
        };

        const Component = components[stepId];
        return Component ? <Component {...stepConfig} /> : <ErrorComponent />;
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {renderStepComponent(currentStep)}
        </Box>
    );
};
```

### 📊 Database Schema

#### Workflow State Tables

```sql
-- Workflow sessions and state management
CREATE TABLE workflow_state (
    session_id VARCHAR(255) PRIMARY KEY,
    workflow_type VARCHAR(50) NOT NULL,
    current_step VARCHAR(100) NOT NULL,
    user_data JSONB,
    context JSONB,
    navigation_history JSONB,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicle data and search criteria
CREATE TABLE vehicle_search_criteria (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES workflow_state(session_id),
    make VARCHAR(100),
    model VARCHAR(100),
    year_min INTEGER,
    year_max INTEGER,
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    mileage_max INTEGER,
    body_type VARCHAR(50),
    fuel_type VARCHAR(50),
    province VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lead information and contact details
CREATE TABLE lead_information (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) REFERENCES workflow_state(session_id),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    preferred_contact_method VARCHAR(20),
    financing_interested BOOLEAN,
    credit_assessed BOOLEAN,
    assigned_dealer_id VARCHAR(100),
    lead_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Indexing Strategy

```sql
-- Performance optimization indexes
CREATE INDEX idx_workflow_state_session_status ON workflow_state(session_id, status);
CREATE INDEX idx_workflow_state_type_step ON workflow_state(workflow_type, current_step);
CREATE INDEX idx_workflow_state_updated ON workflow_state(updated_at);

CREATE INDEX idx_vehicle_criteria_session ON vehicle_search_criteria(session_id);
CREATE INDEX idx_vehicle_criteria_search ON vehicle_search_criteria(make, model, price_min, price_max);

CREATE INDEX idx_lead_session ON lead_information(session_id);
CREATE INDEX idx_lead_assignment ON lead_information(assigned_dealer_id, lead_score);
```

### 🔒 Security Implementation

#### CORS Configuration

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // Configure for production
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

#### Input Validation

```java
// DTOs with validation annotations
public class StartWorkflowRequest {
    @NotBlank(message = "Workflow type is required")
    @Pattern(regexp = "^(buying|selling)$", message = "Invalid workflow type")
    private String workflowType;

    @NotBlank(message = "Session ID is required")
    private String sessionId;

    private Map<String, Object> context;
}

public class TransitionRequest {
    @NotBlank(message = "Session ID is required")
    private String sessionId;

    @NotBlank(message = "Current step is required")
    private String currentStep;

    @NotNull(message = "Form data is required")
    @Valid
    private Map<String, Object> formData;
}
```

#### Security Headers

```yaml
# application.yml security configuration
server:
  servlet:
    session:
      cookie:
        secure: true
        http-only: true
        same-site: strict

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
```

### 🚀 Performance Optimization

#### Caching Strategy

**Redis Configuration:**

```java
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setDefaultSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }

    @Bean
    @ConditionalOnProperty(name = "spring.redis.enabled", havingValue = "true")
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeValuesWith(
                RedisSerializationContext.SerializationPair.fromSerializer(
                    new GenericJackson2JsonRedisSerializer()
                )
            );

        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        cacheConfigurations.put("vehicle-filters", config.entryTtl(Duration.ofHours(1)));
        cacheConfigurations.put("workflow-definitions", config.entryTtl(Duration.ofHours(24)));

        return RedisCacheManager.builder(redisConnectionFactory)
            .cacheDefaults(config)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }
}
```

#### Database Connection Pooling

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/trex_workflow
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      idle-timeout: 300000
      max-lifetime: 1200000
      connection-timeout: 20000

  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 20
          order_inserts: true
          order_updates: true
        connection:
          provider_disables_autocommit: true
```

### 🔧 Development Workflow

#### pnpm Workspace Configuration

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'microfrontends/*'
  - 'host-app'

# Shared dependencies and scripts
shared-workspace-protocol: rolling

# Peer dependency management
auto-install-peers: true

# Strict dependency resolution
strict-peer-dependencies: true
```

#### Docker Compose Setup

```yaml
version: '3.8'
services:
  workflowservice:
    build:
      context: ./backend/workflowservice
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/trex_workflow
      - SPRING_DATASOURCE_USERNAME=trex_user
      - SPRING_DATASOURCE_PASSWORD=trex_password
    depends_on:
      - postgres
      - redis
    networks:
      - trex-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=trex_workflow
      - POSTGRES_USER=trex_user
      - POSTGRES_PASSWORD=trex_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - trex-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - trex-network

  buying-flow:
    build:
      context: ./microfrontends/buying-flow
      dockerfile: Dockerfile
    ports:
      - "3001:80"
    environment:
      - REACT_APP_BACKEND_API_URL=http://localhost:8080/api
    networks:
      - trex-network

  host-app:
    build:
      context: ./host-app
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    networks:
      - trex-network

volumes:
  postgres_data:
  redis_data:

networks:
  trex-network:
    driver: bridge
```

### 🧪 Testing Strategy

#### Backend Testing

```java
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
public class WorkflowEngineIntegrationTest {

    @Autowired
    private WorkflowEngine workflowEngine;

    @Autowired
    private WorkflowStateRepository stateRepository;

    @Test
    public void testBuyingWorkflowTransition() {
        // Given
        String sessionId = UUID.randomUUID().toString();
        WorkflowState initialState = workflowEngine.initializeWorkflow("buying");

        // When
        Map<String, Object> formData = Map.of("intent", "buying");
        WorkflowTransitionResponse response =
            workflowEngine.processTransition(sessionId, "intent-selection", formData);

        // Then
        assertEquals("vehicle-search", response.getStepId());
        assertEquals(ResponseStatus.SUCCESS, response.getStatus());
    }
}
```

#### Frontend Testing

```typescript
// App.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('App Integration', () => {
    it('renders intent selection step', async () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <App />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('What would you like to do today?')).toBeInTheDocument();
        });
    });

    it('transitions from intent selection to vehicle search', async () => {
        render(
            <QueryClientProvider client={createTestQueryClient()}>
                <App />
            </QueryClientProvider>
        );

        const buyingButton = await screen.findByText('Buying a Vehicle');
        fireEvent.click(buyingButton);

        const continueButton = screen.getByText('Continue');
        fireEvent.click(continueButton);

        await waitFor(() => {
            expect(screen.getByText('Find Your Perfect Vehicle')).toBeInTheDocument();
        });
    });
});
```

### 📦 Deployment Strategy

#### Production Docker Configuration

```dockerfile
# Multi-stage build for optimal image size
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Production Configuration

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://workflowservice:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🔍 Monitoring & Observability

#### Health Checks

```java
@RestController
@RequestMapping("/actuator")
public class HealthCheckController {

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        HealthResponse response = HealthResponse.builder()
            .status("UP")
            .timestamp(LocalDateTime.now())
            .services(Map.of(
                "database", checkDatabase(),
                "redis", checkRedis(),
                "external-apis", checkExternalApis()
            ))
            .build();
        return ResponseEntity.ok(response);
    }
}
```

#### Metrics Collection

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
      percentiles:
        http.server.requests: 0.5, 0.95, 0.99
```

#### Structured Logging

```java
@Slf4j
@Service
public class WorkflowEngine {

    public WorkflowTransitionResponse processTransition(String sessionId, String currentStep, Map<String, Object> formData) {
        log.info("Processing workflow transition: sessionId={}, currentStep={}, formDataKeys={}",
                sessionId, currentStep, formData.keySet());

        try {
            // Business logic here
            log.debug("Transition validation passed for step: {}", currentStep);

            return WorkflowTransitionResponse.builder()
                .status(ResponseStatus.SUCCESS)
                .stepId(nextStep)
                .build();

        } catch (Exception e) {
            log.error("Error processing workflow transition: sessionId={}, step={}, error={}",
                     sessionId, currentStep, e.getMessage(), e);
            throw e;
        }
    }
}
```

### 🚀 Scalability Considerations

#### Horizontal Scaling Strategy

**Stateless Design:**
- Workflow state stored in database/external cache
- No server-side session storage
- API responses contain complete context
- Frontend manages UI state only

**Database Scaling:**
- Read replicas for query operations
- Connection pooling optimization
- Efficient indexing strategy
- Query optimization and caching

**External Service Resilience:**
```java
// Circuit breaker pattern implementation
@Service
public class VehicleService {

    @CircuitBreaker(name = "vehicle-api", fallbackMethod = "fallback")
    public List<Vehicle> searchVehicles(VehicleSearchCriteria criteria) {
        // External API call
        return restTemplate.postForObject(vehicleApiUrl, criteria, List.class);
    }

    public List<Vehicle> fallback(VehicleSearchCriteria criteria, Throwable throwable) {
        log.warn("Vehicle API unavailable, using fallback: {}", throwable.getMessage());
        return getCachedResults(criteria);
    }
}
```

This comprehensive technical architecture ensures T-Rex is secure, scalable, maintainable, and provides an excellent user experience across all integration scenarios.