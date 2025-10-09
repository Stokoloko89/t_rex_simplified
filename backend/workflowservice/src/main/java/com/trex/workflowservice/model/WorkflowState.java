package com.trex.workflowservice.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "workflow_states")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowState {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String sessionId;
    
    @Column(nullable = false)
    private String workflowType;
    
    @Column(nullable = false)
    private String currentStep;
    
    @Transient
    private Map<String, Object> userData = new HashMap<>();
    
    @Transient
    private Map<String, Object> context = new HashMap<>();
    
    @Transient
    private Map<String, Object> navigationHistory = new HashMap<>();
    
    @Enumerated(EnumType.STRING)
    private WorkflowStatus status = WorkflowStatus.IN_PROGRESS;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum WorkflowStatus {
        IN_PROGRESS,
        COMPLETED,
        ABANDONED,
        ERROR
    }
}
