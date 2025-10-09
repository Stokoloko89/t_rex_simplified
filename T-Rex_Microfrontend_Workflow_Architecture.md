# T-Rex Microfrontend Workflow Architecture

## Comprehensive Workflow Architecture

This document outlines a unified architecture that combines the T-Rex Core Application Flow with microfrontend best practices, featuring backend-driven workflow orchestration for enhanced security, consistency, and maintainability.

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Host Website Integration Layer"
        HW[Host Website] --> RC[Root Config - Single-SPA]
        RC --> MF[Workflow Microfrontend]
    end
    
    subgraph "Frontend Layer (Thin Client)"
        MF --> WP[Workflow Provider]
        WP --> SR[Step Renderer]
        SR --> SC[Step Components]
        SC --> SUI[Shared UI Library]
    end
    
    subgraph "Backend Workflow Engine (Orchestrator)"
        WE[Workflow Engine Service] --> WD[Workflow Definitions]
        WE --> WS[Workflow State Manager]
        WE --> VE[Validation Engine]
        WS --> WSR[Workflow State Repository]
    end
    
    subgraph "Business Services"
        BS[Business Services] --> LS[Lead Service]
        BS --> VS[Vehicle Service]
        BS --> CS[Communication Service]
        BS --> CRS[Credit Service]
    end
    
    subgraph "External Integrations"
        EI[External Services] --> VDA[Vehicle Data APIs]
        EI --> CCA[Credit Check APIs]
        EI --> CMA[Communication APIs]
        EI --> DNA[Dealer Network APIs]
    end
    
    WP -.->|HTTP API Calls| WE
    WE --> BS
    BS --> EI
    
    style WE fill:#e1f5fe
    style MF fill:#f3e5f5
    style BS fill:#e8f5e8
```

## 2. Core Application Flow (Backend-Driven)

```mermaid
flowchart TD
    Start([User Visits Host Website]) --> Load[Load Microfrontend]
    Load --> Init[Initialize Workflow Session]
    Init --> WE[Workflow Engine: /workflow/start]
    
    WE --> Intent{Backend Returns: Intent Selection Step}
    
    Intent -->|User Selects Buying| BuyingTransition[POST /workflow/transition]
    Intent -->|User Selects Selling| SellingTransition[POST /workflow/transition]
    
    subgraph "Backend-Driven Buying Flow"
        BuyingTransition --> BVehicleInMind{Backend Returns: Vehicle Knowledge Step}
        BVehicleInMind -->|Knows Vehicle| BVehicleSearchStep[Backend Returns: Vehicle Search Form]
        BVehicleInMind -->|Needs Help| BCarInStep[Backend Returns: CarIn Analytics Questions]
        
        BVehicleSearchStep --> BSearchAPI[Backend: Execute Vehicle Search]
        BSearchAPI --> BSearchResults[Backend Returns: Search Results Component]
        
        BCarInStep --> BCarInAPI[Backend: Process CarIn Answers]
        BCarInAPI --> BCarInResults[Backend Returns: CarIn Results Component]
        
        BSearchResults --> BVehicleSelect[Backend Returns: Vehicle Selection Component]
        BCarInResults --> BVehicleSelect
        
        BVehicleSelect --> BConfirmation[Backend Returns: Buying Confirmation Step]
        BConfirmation --> BLeadSubmit[Backend: Submit Lead via Saga Pattern]
        BLeadSubmit --> BComplete[Backend Returns: Completion Step]
    end
    
    subgraph "Backend-Driven Selling Flow"
        SellingTransition --> SHasBuyer{Backend Returns: Has Buyer Step}
        
        SHasBuyer -->|Has Buyer| SBuyerType{Backend Returns: Buyer Type Step}
        SHasBuyer -->|No Buyer| SDealerNetwork[Backend Returns: Dealer Network Step]
        
        SBuyerType -->|Private| SPrivateFlow[Backend Returns: Private Buyer Steps]
        SBuyerType -->|Dealer| SReplacement[Backend Returns: Replacement Vehicle Step]
        
        SPrivateFlow --> SFinancing{Backend Returns: Financing Needs Step}
        SFinancing -->|Needs Financing| SCreditCheck[Backend: Execute Credit Check]
        SFinancing -->|No Financing| SSellingConfirm[Backend Returns: Selling Confirmation]
        SCreditCheck --> SSellingConfirm
        
        SDealerNetwork --> SCreditConsent[Backend Returns: Credit Consent Step]
        SCreditConsent --> SDealerConfirm[Backend Returns: Dealer Confirmation Step]
        SDealerConfirm --> SReplacement{Backend Returns: Replacement Vehicle Step}
        
        SSellingConfirm --> SReplacement
        
        SReplacement -->|Wants Replacement| SharedVehicleFlow[Backend: Transition to Shared Vehicle Flow]
        SReplacement -->|No Replacement| SComplete
        
        SharedVehicleFlow --> BVehicleInMind
    end
    
    BComplete --> EventDriven[Trigger Async Events]
    SComplete --> EventDriven
    
    EventDriven --> LeadScoring[Async: Lead Scoring]
    EventDriven --> DealerRouting[Async: Dealer Routing]
    EventDriven --> Communications[Async: Multi-Channel Communications]
    
    LeadScoring --> Final[Workflow Complete]
    DealerRouting --> Final
    Communications --> Final
    
    style WE fill:#e1f5fe
    style EventDriven fill:#fff3e0
    style Final fill:#e8f5e8
```

## 3. Backend Workflow Engine Architecture

```mermaid
graph TB
    subgraph "Workflow Engine Core"
        API[Workflow API Controller] --> WE[Workflow Engine Service]
        WE --> WD[Workflow Definitions Registry]
        WE --> SM[State Manager]
        WE --> VE[Validation Engine]
        WE --> TE[Transition Engine]
    end
    
    subgraph "Workflow State Management"
        SM --> WSR[(Workflow State Repository)]
        SM --> SC[State Cache - Redis]
        SM --> SH[State History Tracker]
    end
    
    subgraph "Business Logic Integration"
        TE --> BLO[Business Logic Orchestrator]
        BLO --> SP[Saga Pattern Coordinator]
        BLO --> EB[Event Bus Publisher]
        
        SP --> LS[Lead Service]
        SP --> VS[Vehicle Service]
        SP --> CS[Communication Service]
        SP --> CRS[Credit Service]
    end
    
    subgraph "External Service Integration"
        LS --> CB1[Circuit Breaker: Lead APIs]
        VS --> CB2[Circuit Breaker: Vehicle APIs]
        CS --> CB3[Circuit Breaker: Communication APIs]
        CRS --> CB4[Circuit Breaker: Credit APIs]
        
        CB1 --> EXT1[External Lead Services]
        CB2 --> EXT2[External Vehicle APIs]
        CB3 --> EXT3[Communication Providers]
        CB4 --> EXT4[Credit Check Services]
    end
    
    subgraph "Event-Driven Processing"
        EB --> MQ[Message Queue - RabbitMQ/Kafka]
        MQ --> EH1[Lead Event Handler]
        MQ --> EH2[Communication Event Handler]
        MQ --> EH3[Analytics Event Handler]
    end
    
    style WE fill:#e1f5fe
    style SP fill:#fff3e0
    style EB fill:#f3e5f5
```

## 4. Frontend Microfrontend Architecture

```mermaid
graph TB
    subgraph "Host Website Integration"
        HW[Host Website] --> RC[Single-SPA Root Config]
        RC --> |Module Federation| MF[Workflow Microfrontend]
    end
    
    subgraph "Microfrontend Application"
        MF --> APP[App Component with Theme Provider]
        APP --> WP[Workflow Provider Context]
        WP --> SR[Step Renderer]
        
        SR --> |Dynamic Import| SC[Step Components]
        SC --> IS[Intent Selection]
        SC --> VS[Vehicle Search]
        SC --> CA[CarIn Analytics]
        SC --> VR[Vehicle Results]
        SC --> CF[Confirmation Steps]
        SC --> ER[Error Components]
    end
    
    subgraph "Shared Component Library"
        SC --> SUI[Shared UI Components]
        SUI --> BUT[Buttons]
        SUI --> FOR[Forms]
        SUI --> CAR[Cards]
        SUI --> MOD[Modals]
        SUI --> LAY[Layouts]
    end
    
    subgraph "API Communication Layer"
        WP --> AC[API Client]
        AC --> INT[Interceptors]
        AC --> ERR[Error Handlers]
        AC --> RET[Retry Logic]
        
        AC -.->|HTTPS| BE[Backend Workflow Engine]
    end
    
    subgraph "State Management"
        WP --> LS[Loading States]
        WP --> ES[Error States]
        WP --> WS[Workflow State Cache]
        WP --> SID[Session ID Manager]
    end
    
    style MF fill:#f3e5f5
    style WP fill:#e8f5e8
    style AC fill:#fff3e0
```

## 5. Detailed Workflow State Machine

```mermaid
stateDiagram-v2
    [*] --> SessionInit
    SessionInit --> IntentSelection : /workflow/start
    
    IntentSelection --> BuyingFlow : intent=buying
    IntentSelection --> SellingFlow : intent=selling
    
    state BuyingFlow {
        [*] --> VehicleKnowledge
        VehicleKnowledge --> VehicleSearch : knows_vehicle=true
        VehicleKnowledge --> CarInAnalytics : needs_help=true
        
        VehicleSearch --> SearchExecution
        SearchExecution --> SearchResults
        
        CarInAnalytics --> CarInProcessing
        CarInProcessing --> CarInResults
        
        SearchResults --> VehicleSelection
        CarInResults --> VehicleSelection
        
        VehicleSelection --> BuyingConfirmation
        BuyingConfirmation --> LeadSubmission
        LeadSubmission --> BuyingComplete
    }
    
    state SellingFlow {
        [*] --> HasBuyerCheck
        HasBuyerCheck --> WithBuyerFlow : has_buyer=true
        HasBuyerCheck --> WithoutBuyerFlow : has_buyer=false
        
        state WithBuyerFlow {
            [*] --> BuyerTypeCheck
            BuyerTypeCheck --> PrivateBuyerFlow : buyer_type=private
            BuyerTypeCheck --> DealerBuyerFlow : buyer_type=dealer
            
            PrivateBuyerFlow --> FinancingCheck
            FinancingCheck --> CreditCheck : needs_financing=true
            FinancingCheck --> SellingConfirmation : needs_financing=false
            CreditCheck --> SellingConfirmation
            
            DealerBuyerFlow --> DealerInformation
            DealerInformation --> DealerSubmission
        }
        
        state WithoutBuyerFlow {
            [*] --> DealerNetworkProcess
            DealerNetworkProcess --> CreditConsent
            CreditConsent --> DealerConfirmation
        }
        
        SellingConfirmation --> ReplacementCheck
        DealerSubmission --> DealerComplete
        DealerConfirmation --> ReplacementCheck
        
        ReplacementCheck --> SharedVehicleFlow : wants_replacement=true
        ReplacementCheck --> SellingComplete : wants_replacement=false
        
        SharedVehicleFlow --> VehicleKnowledge
    }
    
    BuyingComplete --> AsyncProcessing
    SellingComplete --> AsyncProcessing
    DealerComplete --> AsyncProcessing
    
    state AsyncProcessing {
        [*] --> LeadScoring
        [*] --> DealerRouting
        [*] --> CommunicationSending
        
        LeadScoring --> ProcessingComplete
        DealerRouting --> ProcessingComplete
        CommunicationSending --> ProcessingComplete
    }
    
    AsyncProcessing --> [*]
```

## 6. API Contract Specifications

### 6.1 Workflow Engine API

```yaml
# OpenAPI 3.0 Specification
openapi: 3.0.0
info:
  title: T-Rex Workflow Engine API
  version: 1.0.0

paths:
  /api/workflow/start:
    post:
      summary: Initialize a new workflow session
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sessionId:
                  type: string
                  format: uuid
                workflowType:
                  type: string
                  enum: [buying, selling]
                context:
                  type: object
      responses:
        200:
          description: Workflow started successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowStepResponse'

  /api/workflow/transition:
    post:
      summary: Process a workflow transition
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sessionId:
                  type: string
                  format: uuid
                currentStep:
                  type: string
                data:
                  type: object
      responses:
        200:
          description: Transition processed successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowStepResponse'
        400:
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'

  /api/workflow/back:
    post:
      summary: Navigate back in the workflow
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sessionId:
                  type: string
                  format: uuid
                currentStep:
                  type: string
      responses:
        200:
          description: Back navigation successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WorkflowStepResponse'

components:
  schemas:
    WorkflowStepResponse:
      type: object
      properties:
        stepId:
          type: string
        componentName:
          type: string
        data:
          type: object
        validationRules:
          type: object
        navigationOptions:
          type: object
          properties:
            canGoBack:
              type: boolean
            nextStepId:
              type: string
        uiConfig:
          type: object
    
    ValidationError:
      type: object
      properties:
        field:
          type: string
        message:
          type: string
        code:
          type: string
```

## 7. Implementation Strategy

### 7.1 Phase 1: Core Infrastructure
- Set up monorepo structure with workspaces
- Implement Workflow Engine with basic state management
- Create shared UI component library
- Set up Single-SPA root configuration
- Implement basic buying flow (Intent → Vehicle Search → Results)

### 7.2 Phase 2: Advanced Workflows
- Complete selling flow implementation
- Add CarIn Analytics integration
- Implement shared vehicle discovery flow
- Add comprehensive validation engine
- Implement error handling and fallbacks

### 7.3 Phase 3: Business Logic & Integrations
- Implement Saga pattern for complex transactions
- Add circuit breakers for external services
- Implement event-driven architecture
- Add lead scoring and dealer routing
- Complete communication service integration

### 7.4 Phase 4: Production Readiness
- Add comprehensive monitoring and logging
- Implement automated testing suite
- Set up CI/CD pipelines
- Add security measures and authentication
- Performance optimization and caching

## 8. Key Benefits of This Architecture

### 8.1 Maintainability
- **Single Source of Truth**: All workflow logic centralized in backend
- **Consistent State Management**: Backend manages all state transitions
- **Easy Updates**: Workflow changes require only backend updates
- **Clear Separation**: Frontend focuses purely on presentation

### 8.2 Security
- **Server-Side Validation**: All business rules enforced on backend
- **Secure State**: Sensitive data never exposed to frontend
- **Controlled Flow**: Impossible to bypass workflow steps from frontend
- **API-First**: All interactions through secure, authenticated APIs

### 8.3 Scalability
- **Independent Scaling**: Frontend and backend scale independently
- **Microservice Ready**: Backend services can be split as needed
- **Event-Driven**: Asynchronous processing prevents bottlenecks
- **Circuit Breakers**: Resilient to external service failures

### 8.4 Integration Flexibility
- **Host Agnostic**: Works in any website with minimal integration
- **API Contracts**: Clear, versioned interfaces between components
- **Module Federation**: Dynamic loading of microfrontend components
- **Progressive Enhancement**: Graceful degradation for older browsers

This architecture provides a robust, scalable, and maintainable foundation for the T-Rex microfrontend application while adhering to modern best practices and ensuring seamless integration into third-party websites.