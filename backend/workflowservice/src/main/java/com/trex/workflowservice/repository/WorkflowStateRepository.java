package com.trex.workflowservice.repository;

import com.trex.workflowservice.model.WorkflowState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowStateRepository extends JpaRepository<WorkflowState, Long> {

    Optional<WorkflowState> findBySessionId(String sessionId);
    
    List<WorkflowState> findByWorkflowTypeAndStatus(String workflowType, WorkflowState.WorkflowStatus status);
    
    @Query("SELECT ws FROM WorkflowState ws WHERE ws.updatedAt < :cutoffTime AND ws.status = :status")
    List<WorkflowState> findStaleWorkflows(@Param("cutoffTime") LocalDateTime cutoffTime, 
                                          @Param("status") WorkflowState.WorkflowStatus status);
    
    @Query("SELECT COUNT(ws) FROM WorkflowState ws WHERE ws.workflowType = :workflowType AND ws.status = :status")
    Long countByWorkflowTypeAndStatus(@Param("workflowType") String workflowType, 
                                     @Param("status") WorkflowState.WorkflowStatus status);
}
