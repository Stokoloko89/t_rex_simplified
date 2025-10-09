package com.trex.workflowservice.workflow;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class WorkflowDefinitions {
    
    private final List<WorkflowDefinition> workflowDefinitions;
    private final Map<String, WorkflowDefinition> workflowMap;
    
    public WorkflowDefinitions(List<WorkflowDefinition> workflowDefinitions) {
        this.workflowDefinitions = workflowDefinitions;
        this.workflowMap = workflowDefinitions.stream()
                .collect(Collectors.toMap(
                    WorkflowDefinition::getWorkflowType,
                    Function.identity()
                ));
    }
    
    public WorkflowDefinition getWorkflow(String workflowType) {
        WorkflowDefinition workflow = workflowMap.get(workflowType);
        if (workflow == null) {
            throw new IllegalArgumentException("Unknown workflow type: " + workflowType);
        }
        return workflow;
    }
    
    public boolean isValidWorkflowType(String workflowType) {
        return workflowMap.containsKey(workflowType);
    }
    
    public List<String> getAvailableWorkflowTypes() {
        return workflowDefinitions.stream()
                .map(WorkflowDefinition::getWorkflowType)
                .toList();
    }
}
