package com.trex.workflowservice.service;

import com.trex.workflowservice.model.WorkflowState;
import com.trex.workflowservice.model.WorkflowTransitionResponse;
import com.trex.workflowservice.repository.WorkflowStateRepository;
import com.trex.workflowservice.workflow.WorkflowDefinition;
import com.trex.workflowservice.workflow.WorkflowDefinitions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowEngine {

    private final WorkflowStateRepository stateRepository;
    private final WorkflowDefinitions workflowDefinitions;

    @Transactional
    public WorkflowTransitionResponse startWorkflow(String sessionId, String workflowType) {
        log.info("Starting workflow: {} for session: {}", workflowType, sessionId);
        
        try {
            // Check if session already exists
            var existingState = stateRepository.findBySessionId(sessionId);
            if (existingState.isPresent()) {
                log.warn("Session {} already exists, returning current state", sessionId);
                WorkflowState state = existingState.get();
                WorkflowDefinition workflow = workflowDefinitions.getWorkflow(state.getWorkflowType());
                return workflow.getStepConfig(state.getCurrentStep(), state.getContext());
            }
            
            // Initialize new workflow state
            WorkflowDefinition workflow = workflowDefinitions.getWorkflow(workflowType);
            WorkflowState newState = workflow.initializeState(sessionId);
            stateRepository.save(newState);
            
            log.info("Successfully started workflow for session: {}", sessionId);
            return workflow.getStepConfig(newState.getCurrentStep(), newState.getContext());
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid workflow type: {}", workflowType, e);
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.BUSINESS_RULE_ERROR)
                    .message("Invalid workflow type: " + workflowType)
                    .build();
        } catch (Exception e) {
            log.error("Error starting workflow for session: {}", sessionId, e);
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.SYSTEM_ERROR)
                    .message("Failed to start workflow: " + e.getMessage())
                    .build();
        }
    }

    @Transactional
    public WorkflowTransitionResponse transition(String sessionId, String currentStep, Map<String, Object> formData) {
        log.info("Processing transition for session: {} from step: {}", sessionId, currentStep);
        
        try {
            WorkflowState state = stateRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Workflow session not found: " + sessionId));
            
            // Validate current step matches state
            if (!currentStep.equals(state.getCurrentStep())) {
                log.warn("Step mismatch for session {}: expected {}, got {}", 
                        sessionId, state.getCurrentStep(), currentStep);
                return WorkflowTransitionResponse.builder()
                        .status(WorkflowTransitionResponse.ResponseStatus.BUSINESS_RULE_ERROR)
                        .message("Step mismatch. Expected: " + state.getCurrentStep() + ", got: " + currentStep)
                        .build();
            }
            
            WorkflowDefinition workflow = workflowDefinitions.getWorkflow(state.getWorkflowType());
            
            // Process the transition
            WorkflowTransitionResponse response = workflow.processTransition(state, currentStep, formData);
            
            // Save updated state
            stateRepository.save(state);
            
            log.info("Successfully processed transition for session: {} to step: {}", 
                    sessionId, response.getStepId());
            return response;
            
        } catch (RuntimeException e) {
            log.error("Error processing transition for session: {}", sessionId, e);
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.SYSTEM_ERROR)
                    .message("Transition failed: " + e.getMessage())
                    .build();
        }
    }

    @Transactional
    public WorkflowTransitionResponse goBack(String sessionId, String currentStep) {
        log.info("Processing back navigation for session: {} from step: {}", sessionId, currentStep);
        
        try {
            WorkflowState state = stateRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Workflow session not found: " + sessionId));
            
            WorkflowDefinition workflow = workflowDefinitions.getWorkflow(state.getWorkflowType());
            
            // Process back navigation
            WorkflowTransitionResponse response = workflow.processBack(state, currentStep);
            
            // Save updated state
            stateRepository.save(state);
            
            log.info("Successfully processed back navigation for session: {} to step: {}", 
                    sessionId, response.getStepId());
            return response;
            
        } catch (RuntimeException e) {
            log.error("Error processing back navigation for session: {}", sessionId, e);
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.SYSTEM_ERROR)
                    .message("Back navigation failed: " + e.getMessage())
                    .build();
        }
    }

    @Transactional(readOnly = true)
    public WorkflowTransitionResponse getWorkflowStatus(String sessionId) {
        log.info("Getting workflow status for session: {}", sessionId);
        
        try {
            WorkflowState state = stateRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Workflow session not found: " + sessionId));
            
            WorkflowDefinition workflow = workflowDefinitions.getWorkflow(state.getWorkflowType());
            return workflow.getStepConfig(state.getCurrentStep(), state.getUserData());
            
        } catch (RuntimeException e) {
            log.error("Error getting workflow status for session: {}", sessionId, e);
            return WorkflowTransitionResponse.builder()
                    .status(WorkflowTransitionResponse.ResponseStatus.SYSTEM_ERROR)
                    .message("Failed to get workflow status: " + e.getMessage())
                    .build();
        }
    }

    @Transactional
    public void abandonWorkflow(String sessionId) {
        log.info("Abandoning workflow for session: {}", sessionId);
        
        try {
            WorkflowState state = stateRepository.findBySessionId(sessionId)
                    .orElseThrow(() -> new RuntimeException("Workflow session not found: " + sessionId));
            
            state.setStatus(WorkflowState.WorkflowStatus.ABANDONED);
            stateRepository.save(state);
            
            log.info("Successfully abandoned workflow for session: {}", sessionId);
            
        } catch (RuntimeException e) {
            log.error("Error abandoning workflow for session: {}", sessionId, e);
        }
    }
}
