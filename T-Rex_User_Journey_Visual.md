# T-Rex User Journey Visual Guide

## Complete User Experience Flow

```mermaid
journey
    title T-Rex Vehicle Marketplace User Journey

    section Host Website Integration
        User visits website: 5: User
        Microfrontend loads: 4: System
        Workflow initializes: 4: Backend

    section Buying Flow
        User selects buying: 5: User
        Vehicle search loads: 4: System
        User sets search criteria: 4: User
            Make/Model: 3: User
            Price Range: 3: User
            Location: 3: User
            Year/Mileage: 3: User
        Search executes: 5: Backend
        Results display: 5: System
        User browses vehicles: 4: User
        Vehicle selection: 5: User
        Lead form appears: 4: System
        User enters details: 4: User
        Confirmation step: 5: System
        Lead submitted: 5: Backend

    section Selling Flow
        User selects selling: 5: User
        Buyer check: 4: System
        "Has buyer?" decision: 4: User
        If no buyer: 3: User
            Dealer network: 5: Backend
            Credit consent: 3: User
            Dealer offers: 5: System
        If has buyer: 4: User
            Buyer type selection: 4: User
                Private or Dealer: 3: User
            If private: 4: User
                Financing check: 3: User
                Credit assessment: 4: Backend
            If dealer: 3: User
                Dealer details: 3: User
        Replacement vehicle?: 3: User
        If yes: 4: User
            Return to buying flow: 5: System
        If no: 3: User
            Selling complete: 5: System

    section Async Processing
        Lead scoring: 4: Backend
        Dealer routing: 4: Backend
        Communications: 5: Backend
        Analytics tracking: 3: Backend
```

## Workflow State Machine Diagram

```mermaid
stateDiagram-v2
    direction LR

    [*] --> SessionInit
    SessionInit --> IntentSelection: Initialize Workflow

    IntentSelection --> BuyingFlow: intent=buying
    IntentSelection --> SellingFlow: intent=selling

    state BuyingFlow {
        [*] --> VehicleSearch
        VehicleSearch --> SearchResults: Execute Search
        SearchResults --> VehicleDetails: Select Vehicle
        VehicleDetails --> PersonalInfo: Continue to Lead Form
        PersonalInfo --> Confirmation: Submit Details
        Confirmation --> [*]: Lead Complete
    }

    state SellingFlow {
        [*] --> HasBuyerCheck
        HasBuyerCheck --> DealerNetworkFlow: has_buyer=false
        HasBuyerCheck --> BuyerTypeFlow: has_buyer=true

        state BuyerTypeFlow {
            [*] --> BuyerTypeSelection
            BuyerTypeSelection --> PrivateFlow: buyer_type=private
            BuyerTypeSelection --> DealerFlow: buyer_type=dealer

            state PrivateFlow {
                [*] --> FinancingCheck
                FinancingCheck --> CreditCheck: needs_financing=true
                FinancingCheck --> SellingConfirmation: needs_financing=false
                CreditCheck --> SellingConfirmation
                SellingConfirmation --> [*]
            }

            state DealerFlow {
                [*] --> DealerInformation
                DealerInformation --> DealerSubmission
                DealerSubmission --> [*]
            }
        }

        state DealerNetworkFlow {
            [*] --> DealerNetworkProcess
            DealerNetworkProcess --> CreditConsent
            CreditConsent --> DealerConfirmation
            DealerConfirmation --> ReplacementCheck
            ReplacementCheck --> [*]
        }

        ReplacementCheck --> BuyingFlow: wants_replacement=true
        ReplacementCheck --> [*]: wants_replacement=false
    }

    [*] --> AsyncProcessing: All Complete Flows
    AsyncProcessing --> [*]: Processing Complete
```

## User Interface Flow

```mermaid
graph TD
    A[Host Website] --> B[Single-SPA Root Config]
    B --> C[T-Rex Microfrontend Loads]

    C --> D{Intent Selection}
    D -->|Buying| E[Vehicle Buying Flow]
    D -->|Selling| F[Vehicle Selling Flow]

    E --> G[Vehicle Search Form]
    G --> H[Advanced Filters]
    H --> I[Search Execution]
    I --> J[Search Results Display]
    J --> K[Vehicle Selection]
    K --> L[Lead Capture Form]
    L --> M[Confirmation & Submit]

    F --> N{Has Buyer?}
    N -->|No| O[Dealer Network Integration]
    N -->|Yes| P{Buyer Type}
    P -->|Private| Q[Private Buyer Process]
    P -->|Dealer| R[Dealer Transaction Process]

    O --> S[Credit Consent]
    S --> T[Dealer Matching]
    T --> U[Replacement Vehicle Option]

    Q --> V[Financing Assessment]
    V --> W[Credit Check]
    W --> X[Selling Confirmation]

    R --> Y[Dealer Information]
    Y --> Z[Dealer Submission]

    U -->|Yes| E
    U -->|No| AA[Selling Complete]
    X --> AA
    Z --> AA

    M --> BB[Async Processing]
    AA --> BB

    BB --> CC[Lead Scoring]
    BB --> DD[Dealer Routing]
    BB --> EE[Communications]

    CC --> FF[Complete]
    DD --> FF
    EE --> FF
```

## Component Architecture

```mermaid
graph TB
    subgraph "Frontend Microfrontend"
        App[App.tsx] --> WP[Workflow Provider]
        WP --> SR[StepRenderer.tsx]

        SR --> IS[IntentSelection.tsx]
        SR --> VS[VehicleSearch.tsx]
        SR --> VD[VehicleDetails.tsx]
        SR --> PI[PersonalInfo.tsx]
        SR --> CONF[Confirmation.tsx]

        subgraph "Selling Flow Components"
            HB[HasBuyer.tsx]
            BT[BuyerType.tsx]
            PB[PrivateBuyer.tsx]
            DN[DealerNetwork.tsx]
            RC[ReplacementCheck.tsx]
        end

        SR --> HB
        SR --> BT
        SR --> PB
        SR --> DN
        SR --> RC
    end

    subgraph "Shared UI Library"
        SUI[Shared UI Components] --> BUT[Button.tsx]
        SUI --> VC[VehicleCard.tsx]
        SUI --> LS[LoadingSpinner.tsx]
        SUI --> EB[ErrorBoundary.tsx]
        SUI --> SC[StepperComponent.tsx]
    end

    subgraph "Backend Workflow Engine"
        WE[WorkflowEngine.java] --> BWD[BuyingWorkflowDefinition.java]
        WE --> SWD[SellingWorkflowDefinition.java]
        WE --> WSR[WorkflowStateRepository.java]
        WE --> VC[VehicleController.java]
    end

    App --> SUI
    IS --> BUT
    VS --> BUT
    VD --> VC
    PI --> BUT
    CONF --> BUT

    WP -.->|HTTP API| WE
    VC --> VS
    VC --> EXT[External Vehicle APIs]
```

## Data Flow Architecture

```mermaid
flowchart TD
    subgraph "User Interaction Layer"
        UI[User Interface] --> WF[Workflow Provider]
        WF --> API[API Client]
    end

    subgraph "State Management"
        API --> SM[State Manager]
        SM --> WS[(Workflow State DB)]
        SM --> RC[Redis Cache]
        SM --> SH[State History]
    end

    subgraph "Business Logic Layer"
        SM --> WE[Workflow Engine]
        WE --> WD[Workflow Definitions]
        WE --> VE[Validation Engine]
        WE --> TE[Transition Engine]
    end

    subgraph "External Integrations"
        TE --> VS[Vehicle Service]
        TE --> CS[Communication Service]
        TE --> CRS[Credit Service]
        TE --> DNS[Dealer Network Service]

        VS --> CB1[Circuit Breaker]
        CS --> CB2[Circuit Breaker]
        CRS --> CB3[Circuit Breaker]
        DNS --> CB4[Circuit Breaker]

        CB1 --> VDA[Vehicle Data APIs]
        CB2 --> CA[Communication APIs]
        CB3 --> CCA[Credit Check APIs]
        CB4 --> DNA[Dealer Network APIs]
    end

    subgraph "Async Processing"
        WE --> EB[Event Bus]
        EB --> MQ[RabbitMQ/Kafka]

        MQ --> LS[Lead Scoring Service]
        MQ --> DR[Dealer Routing Service]
        MQ --> CS2[Communication Service]
        MQ --> AN[Analytics Service]
    end

    UI -->|User Actions| WF
    WF -->|State Updates| SM
    SM -->|Business Rules| WE
    WE -->|External Calls| VS
    WE -->|External Calls| CS
    WE -->|External Calls| CRS
    WE -->|External Calls| DNS
    WE -->|Events| EB
```

## Technology Stack Overview

### Frontend Stack
- **React 18**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Material UI**: Component library with design system
- **Single-SPA**: Microfrontend framework
- **Webpack 5**: Module bundling and optimization
- **React Query**: Server state management and caching

### Backend Stack
- **Spring Boot 3**: Java web framework
- **PostgreSQL**: Relational database for state management
- **Redis**: Caching and session storage
- **Maven**: Dependency management
- **Docker**: Containerization
- **RabbitMQ**: Message queue for async processing

### Development Tools
- **pnpm**: Fast, disk-efficient package manager
- **ESLint/Prettier**: Code quality and formatting
- **Jest**: Testing framework
- **Maven Surefire**: Backend testing
- **Docker Compose**: Local development environment

## Key Integration Points

### Host Website Integration
```javascript
// Simple integration script
<script src="https://cdn.t-rex.com/t-rex-root-config.js"></script>
<div id="t-rex-container"></div>
```

### API Integration
```typescript
// Clean HTTP API contracts
interface WorkflowApi {
  startSession(): Promise<SessionId>
  getStep(stepId: string): Promise<StepConfig>
  submitTransition(data: FormData): Promise<NextStep>
  goBack(): Promise<PreviousStep>
}
```

### External Service Integration
- **Vehicle Data APIs**: Comprehensive vehicle information
- **Credit Check Services**: Financial assessment
- **Communication APIs**: Multi-channel messaging
- **Dealer Network APIs**: Dealership connectivity

## Benefits Visualization

### Scalability Benefits
- **Horizontal Scaling**: Stateless design enables easy scaling
- **Independent Deployment**: Frontend and backend deploy separately
- **Microservice Ready**: Backend can be split as needed
- **CDN Integration**: Global content delivery

### Security Benefits
- **Backend Validation**: All business rules server-side
- **State Protection**: Sensitive data never in frontend
- **CORS Configuration**: Secure cross-origin requests
- **Input Sanitization**: Protection against XSS attacks

### Performance Benefits
- **Code Splitting**: Components loaded on-demand
- **Caching Strategy**: Multi-level caching implementation
- **Lazy Loading**: Progressive content loading
- **Bundle Optimization**: Minimal JavaScript footprint