package com.trex.workflowservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

 @RestController
 @RequestMapping("/api/workflow")
 @Slf4j
 @CrossOrigin(
     origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"},
     methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},
     allowedHeaders = "*",
     allowCredentials = "true",
     maxAge = 3600
 )
 public class WorkflowController {

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working!");
    }

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startWorkflow(@RequestBody Map<String, Object> request) {
        log.info("Starting workflow request: {}", request);
        
        String workflowType = (String) request.get("workflowType");
        
        // Always start with intent selection for both buying and selling
        Map<String, Object> response = Map.of(
                "stepId", "intent-selection",
                "componentName", "IntentSelection",
                "data", Map.of(
                    "message", "Do you want to buy, or sell a vehicle?",
                    "options", Map.of(
                        "buying", "I want to buy a vehicle",
                        "selling", "I want to sell my vehicle"
                    )
                ),
                "stepNumber", 1,
                "totalSteps", "dynamic", // Steps vary based on user choices
                "canGoBack", false,
                "navigationOptions", Map.of(
                    "canGoBack", false,
                    "nextStepId", "dynamic"
                ),
                "status", "SUCCESS"
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transition")
    public ResponseEntity<Map<String, Object>> transition(@RequestBody Map<String, Object> request) {
        log.error("=== TRANSITION METHOD CALLED ===");
        log.error("Request: {}", request);
        log.info("Transition request: {}", request);
        
        String currentStep = (String) request.get("currentStep");
        Map<String, Object> data = (Map<String, Object>) request.get("data");
        
        log.error("Current step: {}", currentStep);
        log.error("Data: {}", data);
        
        // SPECIAL TEST: If replacement-check with financing=yes, force FinancingAssistanceComplete
        if ("replacement-check".equals(currentStep) && data != null) {
            String replacement = (String) data.get("replacement");
            String financing = (String) data.get("financing");
            log.error("Replacement: {}, Financing: {}", replacement, financing);
            
            if ("no_replacement".equals(replacement) && "yes".equals(financing)) {
                log.error("FORCING FinancingAssistanceComplete response!");
                return ResponseEntity.ok(createFinancingAssistanceResponse());
            }
        }
        
        // Enhanced workflow transitions based on Core Application Flow
        Map<String, Object> response = getNextStepResponse(currentStep, data);
        
        log.error("Response: {}", response);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/back")
    public ResponseEntity<Map<String, Object>> goBack(@RequestBody Map<String, Object> request) {
        log.error("=== BACK NAVIGATION REQUEST ===");
        log.error("Back navigation request: {}", request);
        
        String currentStep = (String) request.get("currentStep");
        Map<String, Object> data = (Map<String, Object>) request.get("data");
        String sessionId = (String) request.get("sessionId");
        
        log.error("Current step: {}, SessionId: {}", currentStep, sessionId);
        log.error("Data: {}", data);
        
        // Simple test - if replacement-check, return success directly
        if ("replacement-check".equals(currentStep)) {
            log.error("=== DIRECT REPLACEMENT CHECK TEST ===");
            Map<String, Object> directResponse = Map.of(
                "stepId", "private-buyer",
                "componentName", "PrivateBuyer",
                "data", Map.of("message", "Tell us about your private buyer"),
                "stepNumber", 4,
                "totalSteps", "5-7",
                "canGoBack", true,
                "status", "SUCCESS"
            );
            log.error("Direct response: {}", directResponse);
            return ResponseEntity.ok(directResponse);
        }
        
        Map<String, Object> response = getPreviousStepResponse(currentStep, data);
        
        log.error("Back navigation response: {}", response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{sessionId}")
    public ResponseEntity<Map<String, Object>> getWorkflowStatus(@PathVariable String sessionId) {
        log.info("Getting workflow status for session: {}", sessionId);
        
        // Return current step status
        Map<String, Object> response = Map.of(
                "stepId", "intent-selection",
                "componentName", "IntentSelection",
                "data", Map.of("message", "What would you like to do today?"),
                "stepNumber", 1,
                "totalSteps", "dynamic",
                "canGoBack", false,
                "status", "SUCCESS"
        );
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/abandon/{sessionId}")
    public ResponseEntity<Void> abandonWorkflow(@PathVariable String sessionId) {
        log.info("Abandoning workflow for session: {}", sessionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Workflow service is healthy");
    }

    private Map<String, Object> getNextStepResponse(String currentStep, Map<String, Object> data) {
        log.info("getNextStepResponse called with currentStep: {} and data: {}", currentStep, data);
        return switch (currentStep) {
            case "intent-selection" -> handleIntentSelection(data);
            case "vehicle-knowledge" -> handleVehicleKnowledge(data);
            case "vehicle-search" -> handleVehicleSearch(data);
            case "carin-analytics" -> handleCarInAnalytics(data);
            case "search-results" -> handleSearchResults(data);
            case "carin-results" -> handleCarInResults(data);
            case "vehicle-selection" -> handleVehicleSelection(data);
            case "buying-confirmation" -> handleBuyingConfirmation(data);
            case "has-buyer" -> handleHasBuyer(data);
            case "buyer-type" -> handleBuyerType(data);
            case "private-buyer" -> handlePrivateBuyer(data);
            case "dealer-network" -> handleDealerNetwork(data);
            case "selling-confirmation" -> handleSellingConfirmation(data);
            case "replacement-check" -> handleReplacementCheck(data);
            default -> createErrorResponse("Unknown step: " + currentStep);
        };
    }

    private Map<String, Object> handleIntentSelection(Map<String, Object> data) {
        String intent = (String) data.get("intent");
        
        if ("buying".equals(intent)) {
            // Core Application Flow: Buying starts with Vehicle Knowledge check
            return Map.of(
                    "stepId", "vehicle-knowledge",
                    "componentName", "VehicleKnowledge",
                    "data", Map.of(
                        "message", "Do you already know which vehicle you want to buy?",
                        "options", Map.of(
                            "knows_vehicle", "Yes, I know what I want",
                            "needs_help", "No, I need help choosing"
                        )
                    ),
                    "stepNumber", 2,
                    "totalSteps", "5-8",
                    "canGoBack", true,
                    "previousStep", "intent-selection",
                    "status", "SUCCESS"
            );
        } else if ("selling".equals(intent)) {
            // Core Application Flow: Selling starts with Has Buyer check
            return Map.of(
                    "stepId", "has-buyer",
                    "componentName", "HasBuyer",
                    "data", Map.of(
                        "message", "Do you already have a buyer for your vehicle?",
                        "options", Map.of(
                            "has_buyer", "Yes, I have a buyer",
                            "no_buyer", "No, I need help finding a buyer"
                        )
                    ),
                    "stepNumber", 2,
                    "totalSteps", "4-7",
                    "canGoBack", true,
                    "previousStep", "intent-selection",
                    "status", "SUCCESS"
            );
        } else {
            return createErrorResponse("Invalid intent: " + intent);
        }
    }

    private Map<String, Object> handleVehicleKnowledge(Map<String, Object> data) {
        String knowledge = (String) data.get("vehicle_knowledge");
        
        if ("knows_vehicle".equals(knowledge)) {
            return Map.of(
                    "stepId", "vehicle-search",
                    "componentName", "VehicleSearch",
                    "data", Map.of(
                        "message", "Tell us about the vehicle you're looking for",
                        "fields", Map.of(
                            "make", "Vehicle Make",
                            "model", "Vehicle Model",
                            "year", "Year",
                            "budget", "Budget Range"
                        )
                    ),
                    "stepNumber", 3,
                    "totalSteps", "5-6",
                    "canGoBack", true,
                    "previousStep", "vehicle-knowledge",
                    "status", "SUCCESS"
            );
        } else if ("needs_help".equals(knowledge)) {
            return Map.of(
                    "stepId", "carin-analytics",
                    "componentName", "CarInAnalytics",
                    "data", Map.of(
                        "message", "Let's help you find the perfect vehicle",
                        "questions", Map.of(
                            "usage", "How will you primarily use this vehicle?",
                            "passengers", "How many passengers do you typically carry?",
                            "budget", "What's your budget range?",
                            "features", "What features are most important to you?"
                        )
                    ),
                    "stepNumber", 3,
                    "totalSteps", "6-8",
                    "canGoBack", true,
                    "previousStep", "vehicle-knowledge",
                    "status", "SUCCESS"
            );
        } else {
            return createErrorResponse("Invalid vehicle knowledge response: " + knowledge);
        }
    }

    private Map<String, Object> handleVehicleSearch(Map<String, Object> data) {
        // Simulate vehicle search execution
        return Map.of(
                "stepId", "search-results",
                "componentName", "SearchResults",
                "data", Map.of(
                    "message", "Here are vehicles matching your criteria",
                    "results", Map.of(
                        "total", 15,
                        "vehicles", "Mock vehicle data would be here"
                    )
                ),
                "stepNumber", 4,
                "totalSteps", "5-6",
                "canGoBack", true,
                "previousStep", "vehicle-search",
                "status", "SUCCESS"
        );
    }

    private Map<String, Object> handleCarInAnalytics(Map<String, Object> data) {
        // Simulate CarIn analytics processing
        return Map.of(
                "stepId", "carin-results",
                "componentName", "CarInResults",
                "data", Map.of(
                    "message", "Based on your preferences, here are our recommendations",
                    "recommendations", Map.of(
                        "primary", "Toyota Camry 2023",
                        "alternatives", "Honda Accord, Nissan Altima"
                    )
                ),
                "stepNumber", 4,
                "totalSteps", "6-8",
                "canGoBack", true,
                "previousStep", "carin-analytics",
                "status", "SUCCESS"
        );
    }

    private Map<String, Object> handleSearchResults(Map<String, Object> data) {
        return handleVehicleSelection(data);
    }

    private Map<String, Object> handleCarInResults(Map<String, Object> data) {
        return handleVehicleSelection(data);
    }

    private Map<String, Object> handleVehicleSelection(Map<String, Object> data) {
        return Map.of(
                "stepId", "buying-confirmation",
                "componentName", "BuyingConfirmation",
                "data", Map.of(
                    "message", "Confirm your vehicle selection and provide contact details",
                    "selectedVehicle", data.get("selectedVehicle"),
                    "fields", Map.of(
                        "name", "Full Name",
                        "email", "Email Address",
                        "phone", "Phone Number"
                    )
                ),
                "stepNumber", 5,
                "totalSteps", "6",
                "canGoBack", true,
                "previousStep", "vehicle-selection",
                "status", "SUCCESS"
        );
    }

    private Map<String, Object> handleBuyingConfirmation(Map<String, Object> data) {
        // Simulate lead submission via Saga pattern
        return Map.of(
                "stepId", "buying-complete",
                "componentName", "BuyingComplete",
                "data", Map.of(
                    "message", "Thank you! Your request has been submitted successfully.",
                    "nextSteps", "A dealer will contact you within 24 hours.",
                    "leadId", "LEAD-" + System.currentTimeMillis()
                ),
                "stepNumber", 6,
                "totalSteps", "6",
                "canGoBack", false,
                "status", "SUCCESS",
                "workflowComplete", true
        );
    }

    // Selling flow handlers
    private Map<String, Object> handleHasBuyer(Map<String, Object> data) {
        String hasBuyer = (String) data.get("has_buyer");
        
        if ("has_buyer".equals(hasBuyer)) {
            return Map.of(
                    "stepId", "buyer-type",
                    "componentName", "BuyerType",
                    "data", Map.of(
                        "message", "What type of buyer do you have?",
                        "options", Map.of(
                            "private", "Private individual",
                            "dealer", "Dealer/Trade-in"
                        )
                    ),
                    "stepNumber", 3,
                    "totalSteps", "5-7",
                    "canGoBack", true,
                    "previousStep", "has-buyer",
                    "status", "SUCCESS"
            );
        } else {
            return Map.of(
                    "stepId", "dealer-network",
                    "componentName", "DealerNetwork",
                    "data", Map.of(
                        "message", "We'll help you find buyers through our dealer network",
                        "fields", Map.of(
                            "vehicleInfo", "Vehicle Information",
                            "condition", "Vehicle Condition",
                            "mileage", "Current Mileage"
                        )
                    ),
                    "stepNumber", 3,
                    "totalSteps", "4-5",
                    "canGoBack", true,
                    "previousStep", "has-buyer",
                    "status", "SUCCESS"
            );
        }
    }

    private Map<String, Object> handleBuyerType(Map<String, Object> data) {
        String buyerType = (String) data.get("buyer_type");
        
        if ("private".equals(buyerType)) {
            return Map.of(
                    "stepId", "private-buyer",
                    "componentName", "PrivateBuyer",
                    "data", Map.of(
                        "message", "Private sale details",
                        "fields", Map.of(
                            "financing", "Does buyer need financing?"
                        )
                    ),
                    "stepNumber", 4,
                    "totalSteps", "6-7",
                    "canGoBack", true,
                    "previousStep", "buyer-type",
                    "status", "SUCCESS"
            );
        } else {
            return handleSellingConfirmation(data);
        }
    }

    private Map<String, Object> handlePrivateBuyer(Map<String, Object> data) {
        // Pass along the private buyer details to track what assistance they need
        return handleSellingConfirmation(data);
    }

    private Map<String, Object> handleDealerNetwork(Map<String, Object> data) {
        // Pass along dealer network context
        Map<String, Object> contextData = new HashMap<>(data);
        contextData.put("assistance_type", "dealer_network");
        return handleSellingConfirmation(contextData);
    }

    private Map<String, Object> handleSellingConfirmation(Map<String, Object> data) {
        // Pass context through to replacement check so we know what assistance was requested
        log.info("handleSellingConfirmation received data: {}", data);
        
        Map<String, Object> stepData = new HashMap<>();
        stepData.put("message", "Do you need a replacement vehicle?");
        stepData.put("options", Map.of(
            "wants_replacement", "Yes, help me find a replacement",
            "no_replacement", "No, I don't need a replacement"
        ));
        stepData.put("context", data); // Pass through the context from previous steps
        
        log.info("handleSellingConfirmation returning stepData: {}", stepData);
        
        Map<String, Object> response = new HashMap<>();
        response.put("stepId", "replacement-check");
        response.put("componentName", "ReplacementCheck");
        response.put("data", stepData);
        response.put("stepNumber", 5);
        response.put("totalSteps", "6");
        response.put("canGoBack", true);
        response.put("previousStep", "selling-confirmation");
        response.put("status", "SUCCESS");
        
        log.info("handleSellingConfirmation final response: {}", response);
        return response;
    }

    private Map<String, Object> handleReplacementCheck(Map<String, Object> data) {
        System.out.println("=== HANDLE REPLACEMENT CHECK ===");
        System.out.println("Data received: " + data);
        String replacement = (String) data.get("replacement");
        System.out.println("Replacement value: " + replacement);
        
        if ("wants_replacement".equals(replacement)) {
            // Transition to shared vehicle flow (buying flow)
            return Map.of(
                    "stepId", "vehicle-knowledge",
                    "componentName", "VehicleKnowledge",
                    "data", Map.of(
                        "message", "Let's help you find your replacement vehicle",
                        "context", "replacement_vehicle",
                        "options", Map.of(
                            "knows_vehicle", "Yes, I know what I want",
                            "needs_help", "No, I need help choosing"
                        )
                    ),
                    "stepNumber", 6,
                    "totalSteps", "8-10",
                    "canGoBack", true,
                    "previousStep", "replacement-check",
                    "status", "SUCCESS"
            );
        } else {
            // User doesn't need replacement vehicle - determine what assistance they DO need
            System.out.println("User doesn't want replacement vehicle");
            
            // Check for financing directly in data first
            String directFinancing = (String) data.get("financing");
            if ("yes".equals(directFinancing)) {
                System.out.println("DIRECT FINANCING DETECTED - returning FinancingAssistanceComplete");
                return createFinancingAssistanceResponse();
            }
            
            // Check for context structure
            Map<String, Object> context = (Map<String, Object>) data.get("context");
            System.out.println("Extracted context from data: " + context);
            
            if (context != null) {
                // Check private_buyer_details in context
                Map<String, Object> privateBuyerDetails = (Map<String, Object>) context.get("private_buyer_details");
                if (privateBuyerDetails != null) {
                    String contextFinancing = (String) privateBuyerDetails.get("financing");
                    if ("yes".equals(contextFinancing)) {
                        System.out.println("CONTEXT FINANCING DETECTED - returning FinancingAssistanceComplete");
                        return createFinancingAssistanceResponse();
                    }
                }
            }
            
            return determineAppropriateCompletion(context);
        }
    }

    private Map<String, Object> determineAppropriateCompletion(Map<String, Object> context) {
        if (context == null) {
            return createNoAssistanceNeededResponse();
        }

        // Check multiple possible context structures
        // 1. Direct private_buyer_details in context
        Map<String, Object> privateBuyerDetails = (Map<String, Object>) context.get("private_buyer_details");
        
        // 2. If not found, check if context itself contains financing (flattened structure)
        if (privateBuyerDetails == null && context.containsKey("financing")) {
            String financing = (String) context.get("financing");
            if ("yes".equals(financing)) {
                return createFinancingAssistanceResponse();
            }
        }
        
        // 3. Check nested structure
        if (privateBuyerDetails != null) {
            String financing = (String) privateBuyerDetails.get("financing");
            if ("yes".equals(financing)) {
                return createFinancingAssistanceResponse();
            }
        }

        // Check if they need dealer network assistance
        String assistanceType = (String) context.get("assistance_type");
        System.out.println("Assistance type extracted: " + assistanceType);
        
        if ("dealer_network".equals(assistanceType)) {
            System.out.println("DEALER_NETWORK detected - returning DealerNetworkComplete");
            return Map.of(
                    "stepId", "dealer-network-complete",
                    "componentName", "DealerNetworkComplete",
                    "data", Map.of(
                        "message", "Thank you for your submission!",
                        "description", "We'll connect you with dealers in our network who are interested in your vehicle type.",
                        "nextSteps", "Our dealer network team will review your vehicle information and match you with interested buyers within 48 hours.",
                        "assistanceType", "dealer_network"
                    ),
                    "stepNumber", 6,
                    "totalSteps", "6",
                    "canGoBack", false,
                    "status", "SUCCESS",
                    "workflowComplete", true
            );
        }

        // Default: they don't need any assistance
        System.out.println("NO SPECIFIC ASSISTANCE detected - returning NoAssistanceNeeded");
        return createNoAssistanceNeededResponse();
    }

    private Map<String, Object> createFinancingAssistanceResponse() {
        return Map.of(
                "stepId", "financing-assistance-complete",
                "componentName", "FinancingAssistanceComplete",
                "data", Map.of(
                    "message", "Thank you for your request!",
                    "description", "One of our Financial & Insurance (F&I) representatives will be in touch regarding financing assistance for your buyer.",
                    "nextSteps", "Our F&I team will contact you within 24 hours to discuss financing options and next steps.",
                    "assistanceType", "financing"
                ),
                "stepNumber", 6,
                "totalSteps", "6",
                "canGoBack", false,
                "status", "SUCCESS",
                "workflowComplete", true
        );
    }

    private Map<String, Object> createNoAssistanceNeededResponse() {
        return Map.of(
                "stepId", "no-assistance-needed",
                "componentName", "NoAssistanceNeeded",
                "data", Map.of(
                    "message", "You're all set!",
                    "description", "It looks like you have everything under control with your vehicle sale. We're here if you need us in the future!",
                    "nextSteps", "Feel free to return anytime if your situation changes or if you need assistance with future vehicle transactions."
                ),
                "stepNumber", 6,
                "totalSteps", "6",
                "canGoBack", false,
                "status", "SUCCESS",
                "workflowComplete", true
        );
    }

    private Map<String, Object> getPreviousStepResponse(String currentStep, Map<String, Object> data) {
        log.error("=== GETTING PREVIOUS STEP ===");
        log.error("Current step: '{}'", currentStep);
        log.error("Data: {}", data);
        
        // Use if-else approach for better debugging and reliability
        if ("replacement-check".equals(currentStep)) {
            log.error("=== REPLACEMENT CHECK BACK NAVIGATION ===");
            return Map.of(
                "stepId", "private-buyer",
                "componentName", "PrivateBuyer",
                "data", Map.of(
                    "message", "Tell us about your private buyer",
                    "buyerInfo", Map.of(
                        "financing", "Do you need help with financing for your buyer?",
                        "options", Map.of(
                            "yes", "Yes, I need financing assistance",
                            "no", "No, financing is handled"
                        )
                    )
                ),
                "stepNumber", 4,
                "totalSteps", "5-7",
                "canGoBack", true,
                "previousStep", "buyer-type",
                "status", "SUCCESS"
            );
        }
        
        if ("buyer-type".equals(currentStep)) {
            log.error("=== BUYER TYPE BACK NAVIGATION ===");
            return Map.of(
                "stepId", "has-buyer",
                "componentName", "HasBuyer",
                "data", Map.of(
                    "message", "Do you already have a buyer for your vehicle?",
                    "options", Map.of(
                        "has_buyer", "Yes, I have a buyer",
                        "no_buyer", "No, I need help finding a buyer"
                    )
                ),
                "stepNumber", 2,
                "totalSteps", "4-7",
                "canGoBack", true,
                "previousStep", "intent-selection",
                "status", "SUCCESS"
            );
        }
        
        if ("private-buyer".equals(currentStep)) {
            log.error("=== PRIVATE BUYER BACK NAVIGATION ===");
            return Map.of(
                "stepId", "buyer-type",
                "componentName", "BuyerType",
                "data", Map.of(
                    "message", "What type of buyer do you have?",
                    "options", Map.of(
                        "private", "Private individual",
                        "dealer", "Dealer/Trade-in"
                    )
                ),
                "stepNumber", 3,
                "totalSteps", "5-7",
                "canGoBack", true,
                "previousStep", "has-buyer",
                "status", "SUCCESS"
            );
        }
        
        if ("dealer-network".equals(currentStep)) {
            log.error("=== DEALER NETWORK BACK NAVIGATION ===");
            return Map.of(
                "stepId", "has-buyer",
                "componentName", "HasBuyer",
                "data", Map.of(
                    "message", "Do you already have a buyer for your vehicle?",
                    "options", Map.of(
                        "has_buyer", "Yes, I have a buyer",
                        "no_buyer", "No, I need help finding a buyer"
                    )
                ),
                "stepNumber", 2,
                "totalSteps", "4-7",
                "canGoBack", true,
                "previousStep", "intent-selection",
                "status", "SUCCESS"
            );
        }
        
        if ("has-buyer".equals(currentStep)) {
            log.error("=== HAS BUYER BACK NAVIGATION ===");
            return Map.of(
                "stepId", "intent-selection",
                "componentName", "IntentSelection",
                "data", Map.of(
                    "message", "What would you like to do today?",
                    "options", Map.of(
                        "buying", "I want to buy a vehicle",
                        "selling", "I want to sell my vehicle"
                    )
                ),
                "stepNumber", 1,
                "totalSteps", "dynamic",
                "canGoBack", false,
                "status", "SUCCESS"
            );
        }
        
        return switch (currentStep) {
            // BUYING FLOW BACK NAVIGATION
            case "vehicle-knowledge" -> {
                log.error("Going back from vehicle-knowledge to intent-selection");
                yield Map.of(
                    "stepId", "intent-selection",
                    "componentName", "IntentSelection",
                    "data", Map.of(
                        "message", "What would you like to do today?",
                        "options", Map.of(
                            "buying", "I want to buy a vehicle",
                            "selling", "I want to sell my vehicle"
                        )
                    ),
                    "stepNumber", 1,
                    "totalSteps", "dynamic",
                    "canGoBack", false,
                    "status", "SUCCESS"
                );
            }
            
            case "vehicle-search", "carin-analytics" -> {
                log.error("Going back from {} to vehicle-knowledge", currentStep);
                yield Map.of(
                    "stepId", "vehicle-knowledge",
                    "componentName", "VehicleKnowledge",
                    "data", Map.of(
                        "message", "Do you already know which vehicle you want?",
                        "options", Map.of(
                            "knows_vehicle", "Yes, I know what I want",
                            "needs_help", "No, I need help choosing"
                        )
                    ),
                    "stepNumber", 2,
                    "totalSteps", "5-8",
                    "canGoBack", true,
                    "previousStep", "intent-selection",
                    "status", "SUCCESS"
                );
            }
            
            case "search-results", "carin-results" -> {
                String previousStep = "carin-results".equals(currentStep) ? "carin-analytics" : "vehicle-search";
                log.error("Going back from {} to {}", currentStep, previousStep);
                
                if ("carin-analytics".equals(previousStep)) {
                    yield Map.of(
                        "stepId", "carin-analytics",
                        "componentName", "CarInAnalytics",
                        "data", Map.of(
                            "message", "Help us understand your preferences",
                            "questions", Map.of(
                                "budget", "What's your budget range?",
                                "usage", "How will you primarily use the vehicle?",
                                "features", "Which features are most important to you?"
                            )
                        ),
                        "stepNumber", 3,
                        "totalSteps", "6-8",
                        "canGoBack", true,
                        "previousStep", "vehicle-knowledge",
                        "status", "SUCCESS"
                    );
                } else {
                    yield Map.of(
                        "stepId", "vehicle-search",
                        "componentName", "VehicleSearch",
                        "data", Map.of(
                            "message", "Search for your ideal vehicle",
                            "searchCriteria", Map.of(
                                "make", "",
                                "model", "",
                                "yearRange", "",
                                "priceRange", ""
                            )
                        ),
                        "stepNumber", 3,
                        "totalSteps", "5-7",
                        "canGoBack", true,
                        "previousStep", "vehicle-knowledge",
                        "status", "SUCCESS"
                    );
                }
            }
            
            case "buying-confirmation" -> {
                log.error("Going back from buying-confirmation to search-results");
                yield Map.of(
                    "stepId", "search-results",
                    "componentName", "SearchResults",
                    "data", Map.of(
                        "message", "Here are vehicles matching your criteria",
                        "results", Map.of("total", 3)
                    ),
                    "stepNumber", 4,
                    "totalSteps", "5-8",
                    "canGoBack", true,
                    "previousStep", "vehicle-search",
                    "status", "SUCCESS"
                );
            }
            
            // SELLING FLOW BACK NAVIGATION
            case "has-buyer" -> {
                log.error("Going back from has-buyer to intent-selection");
                yield Map.of(
                    "stepId", "intent-selection",
                    "componentName", "IntentSelection",
                    "data", Map.of(
                        "message", "What would you like to do today?",
                        "options", Map.of(
                            "buying", "I want to buy a vehicle",
                            "selling", "I want to sell my vehicle"
                        )
                    ),
                    "stepNumber", 1,
                    "totalSteps", "dynamic",
                    "canGoBack", false,
                    "status", "SUCCESS"
                );
            }
            
            case "buyer-type" -> {
                log.error("Going back from buyer-type to has-buyer");
                yield Map.of(
                    "stepId", "has-buyer",
                    "componentName", "HasBuyer",
                    "data", Map.of(
                        "message", "Do you already have a buyer for your vehicle?",
                        "options", Map.of(
                            "has_buyer", "Yes, I have a buyer",
                            "no_buyer", "No, I need help finding a buyer"
                        )
                    ),
                    "stepNumber", 2,
                    "totalSteps", "4-7",
                    "canGoBack", true,
                    "previousStep", "intent-selection",
                    "status", "SUCCESS"
                );
            }
            
            case "private-buyer", "dealer-network" -> {
                String previousStep = "private-buyer".equals(currentStep) ? "buyer-type" : "has-buyer";
                log.error("Going back from {} to {}", currentStep, previousStep);
                
                if ("buyer-type".equals(previousStep)) {
                    yield Map.of(
                        "stepId", "buyer-type",
                        "componentName", "BuyerType",
                        "data", Map.of(
                            "message", "What type of buyer do you have?",
                            "options", Map.of(
                                "private", "Private individual",
                                "dealer", "Dealer/Trade-in"
                            )
                        ),
                        "stepNumber", 3,
                        "totalSteps", "5-7",
                        "canGoBack", true,
                        "previousStep", "has-buyer",
                        "status", "SUCCESS"
                    );
                } else {
                    yield Map.of(
                        "stepId", "has-buyer",
                        "componentName", "HasBuyer",
                        "data", Map.of(
                            "message", "Do you already have a buyer for your vehicle?",
                            "options", Map.of(
                                "has_buyer", "Yes, I have a buyer",
                                "no_buyer", "No, I need help finding a buyer"
                            )
                        ),
                        "stepNumber", 2,
                        "totalSteps", "4-7",
                        "canGoBack", true,
                        "previousStep", "intent-selection",
                        "status", "SUCCESS"
                    );
                }
            }
            
            
            // COMPLETION STEPS - Generally cannot go back
            case "buying-complete", "selling-complete", "financing-assistance-complete", 
                 "dealer-network-complete", "no-assistance-needed" -> {
                log.error("Cannot go back from completion step: {}", currentStep);
                yield createErrorResponse("Cannot go back from completion step: " + currentStep);
            }
            
            // DEFAULT CASE
            default -> {
                log.error("=== DEFAULT CASE REACHED ===");
                log.error("Unknown step for back navigation: '{}'", currentStep);
                log.error("Available cases should include: replacement-check");
                yield createErrorResponse("Cannot go back from step: " + currentStep);
            }
        };
    }

    private Map<String, Object> createErrorResponse(String message) {
        return Map.of(
                "status", "SYSTEM_ERROR",
                "message", message
        );
    }
}
