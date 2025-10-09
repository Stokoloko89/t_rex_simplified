package com.trex.workflowservice.workflow;

import com.trex.workflowservice.model.WorkflowState;
import com.trex.workflowservice.model.WorkflowTransitionResponse;

import java.util.Map;

public interface WorkflowDefinition {
    
    String getWorkflowType();
    
    WorkflowState initializeState(String sessionId);
    
    WorkflowTransitionResponse getStepConfig(String stepId, Map<String, Object> context);
    
    WorkflowTransitionResponse processTransition(WorkflowState state, String currentStep, Map<String, Object> formData);
    
    WorkflowTransitionResponse processBack(WorkflowState state, String currentStep);
    
    boolean validateTransition(String fromStep, String toStep, Map<String, Object> formData);
    
    String getNextStep(String currentStep, Map<String, Object> formData);
    
    String getPreviousStep(String currentStep);
}
