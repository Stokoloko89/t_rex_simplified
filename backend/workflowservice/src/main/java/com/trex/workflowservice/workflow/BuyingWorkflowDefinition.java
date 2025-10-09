package com.trex.workflowservice.workflow;

import com.trex.workflowservice.model.WorkflowState;
import com.trex.workflowservice.model.WorkflowTransitionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class BuyingWorkflowDefinition implements WorkflowDefinition {
    
    private static final String WORKFLOW_TYPE = "buying";
    
    // Step definitions
    private static final String INTENT_SELECTION = "intent-selection";
    private static final String VEHICLE_SEARCH = "vehicle-search";
    private static final String VEHICLE_DETAILS = "vehicle-details";
    private static final String PERSONAL_INFO = "personal-info";
    private static final String CONFIRMATION = "confirmation";
    
    @Override
    public String getWorkflowType() {
        return WORKFLOW_TYPE;
    }
    
    @Override
    public WorkflowState initializeState(String sessionId) {
        WorkflowState state = new WorkflowState();
        state.setSessionId(sessionId);
        state.setWorkflowType(WORKFLOW_TYPE);
        state.setCurrentStep(INTENT_SELECTION);
        state.setUserData(new HashMap<>());
        state.setContext(new HashMap<>());
        state.setNavigationHistory(new HashMap<>());
        state.setStatus(WorkflowState.WorkflowStatus.IN_PROGRESS);
        
        log.info("Initialized buying workflow for session: {}", sessionId);
        return state;
    }
    
    @Override
    public WorkflowTransitionResponse getStepConfig(String stepId, Map<String, Object> context) {
        return switch (stepId) {
            case INTENT_SELECTION -> WorkflowTransitionResponse.builder()
                    .stepId(INTENT_SELECTION)
                    .componentName("IntentSelection")
                    .data(Map.of("message", "What would you like to do today?"))
                    .stepNumber(1)
                    .totalSteps(5)
                    .canGoBack(false)
                    .status(WorkflowTransitionResponse.ResponseStatus.SUCCESS)
                    .build();
                    
            case VEHICLE_SEARCH -> WorkflowTransitionResponse.builder()
                    .stepId(VEHICLE_SEARCH)
                    .componentName("VehicleSearch")
                    .data(context)
                    .stepNumber(2)
                    .totalSteps(5)
                    .canGoBack(true)
                    .previousStep(INTENT_SELECTION)
                    .status(WorkflowTransitionResponse.ResponseStatus.SUCCESS)
                    .build();
                    
            case VEHICLE_DETAILS -> WorkflowTransitionResponse.builder()
                    .stepId(VEHICLE_DETAILS)
                    .componentName("VehicleDetails")
                    .data(context)
                    .stepNumber(3)
                    .totalSteps(5)
                    .canGoBack(true)
                    .previousStep(VEHICLE_SEARCH)
                    .status(WorkflowTransitionResponse.ResponseStatus.SUCCESS)
                    .build();
                    
            case PERSONAL_INFO -> WorkflowTransitionResponse.builder()
                    .stepId(PERSONAL_INFO)
                    .componentName("PersonalInfo")
                    .data(context)
                    .stepNumber(4)
                    .totalSteps(5)
                    .canGoBack(true)
                    .previousStep(VEHICLE_DETAILS)
                    .status(WorkflowTransitionResponse.ResponseStatus.SUCCESS)
                    .build();
                    
            case CONFIRMATION -> WorkflowTransitionResponse.builder()
                    .stepId(CONFIRMATION)
                    .componentName("Confirmation")
                    .data(context)
                    .stepNumber(5)
                    .totalSteps(5)
                    .canGoBack(true)
                    .previousStep(PERSONAL_INFO)
                    .status(WorkflowTransitionResponse.ResponseStatus.SUCCESS)
                    .build();
                    
            default -> WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.SYSTEM_ERROR)
                    .message("Unknown step: " + stepId)
                    .build();
        };
    }
    
    @Override
    public WorkflowTransitionResponse processTransition(WorkflowState state, String currentStep, Map<String, Object> formData) {
        log.info("Processing transition from step: {} with data: {}", currentStep, formData);
        
        // Validate the transition
        String nextStep = getNextStep(currentStep, formData);
        if (nextStep == null) {
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.BUSINESS_RULE_ERROR)
                    .message("Invalid transition from step: " + currentStep)
                    .build();
        }
        
        // Update state
        Map<String, Object> userData = state.getUserData();
        userData.putAll(formData);
        state.setUserData(userData);
        state.setCurrentStep(nextStep);
        
        // Add to navigation history
        Map<String, Object> history = state.getNavigationHistory();
        history.put(currentStep, formData);
        state.setNavigationHistory(history);
        
        // If this is the final step, mark as completed
        if (CONFIRMATION.equals(nextStep)) {
            state.setStatus(WorkflowState.WorkflowStatus.COMPLETED);
        }
        
        // Return next step configuration
        return getStepConfig(nextStep, userData);
    }
    
    @Override
    public WorkflowTransitionResponse processBack(WorkflowState state, String currentStep) {
        log.info("Processing back navigation from step: {}", currentStep);
        
        String previousStep = getPreviousStep(currentStep);
        if (previousStep == null) {
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.BUSINESS_RULE_ERROR)
                    .message("Cannot go back from step: " + currentStep)
                    .build();
        }
        
        // Update current step
        state.setCurrentStep(previousStep);
        
        // Return previous step configuration with existing data
        return getStepConfig(previousStep, state.getUserData());
    }
    
    @Override
    public boolean validateTransition(String fromStep, String toStep, Map<String, Object> formData) {
        return switch (fromStep) {
            case INTENT_SELECTION -> {
                Object intent = formData.get("intent");
                yield "buying".equals(intent) && VEHICLE_SEARCH.equals(toStep);
            }
            case VEHICLE_SEARCH -> VEHICLE_DETAILS.equals(toStep);
            case VEHICLE_DETAILS -> PERSONAL_INFO.equals(toStep);
            case PERSONAL_INFO -> CONFIRMATION.equals(toStep);
            case CONFIRMATION -> INTENT_SELECTION.equals(toStep); // Start new workflow
            default -> false;
        };
    }
    
    @Override
    public String getNextStep(String currentStep, Map<String, Object> formData) {
        return switch (currentStep) {
            case INTENT_SELECTION -> {
                Object intent = formData.get("intent");
                yield "buying".equals(intent) ? VEHICLE_SEARCH : null;
            }
            case VEHICLE_SEARCH -> VEHICLE_DETAILS;
            case VEHICLE_DETAILS -> PERSONAL_INFO;
            case PERSONAL_INFO -> CONFIRMATION;
            case CONFIRMATION -> INTENT_SELECTION; // Start new workflow
            default -> null;
        };
    }
    
    @Override
    public String getPreviousStep(String currentStep) {
        return switch (currentStep) {
            case VEHICLE_SEARCH -> INTENT_SELECTION;
            case VEHICLE_DETAILS -> VEHICLE_SEARCH;
            case PERSONAL_INFO -> VEHICLE_DETAILS;
            case CONFIRMATION -> PERSONAL_INFO;
            default -> null;
        };
    }
}
