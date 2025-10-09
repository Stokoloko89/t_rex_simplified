package com.trex.workflowservice.model;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowTransitionResponse {
    
    private String stepId;
    private String componentName;
    private Map<String, Object> data;
    private Map<String, Object> validation;
    private List<String> nextSteps;
    private String previousStep;
    private Integer stepNumber;
    private Integer totalSteps;
    private boolean canGoBack;
    private String message;
    private ResponseStatus status;
    
    public enum ResponseStatus {
        SUCCESS,
        VALIDATION_ERROR,
        BUSINESS_RULE_ERROR,
        SYSTEM_ERROR
    }
}
