package com.trex.workflowservice.repository;

import com.trex.workflowservice.model.ContactRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository for ContactRequest entity
 * Provides database operations for contact requests
 */
@Repository
public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {

    /**
     * Find contact request by email
     */
    Optional<ContactRequest> findByEmail(String email);

    /**
     * Find all contact requests for a specific vehicle
     */
    @Query("SELECT DISTINCT cr FROM ContactRequest cr " +
           "JOIN cr.vehicleLinks crv " +
           "WHERE crv.vehicle.id = :vehicleId")
    List<ContactRequest> findByVehicleId(@Param("vehicleId") Long vehicleId);

    /**
     * Find all contact requests that include any of the specified vehicle IDs
     */
    @Query("SELECT DISTINCT cr FROM ContactRequest cr " +
           "JOIN cr.vehicleLinks crv " +
           "WHERE crv.vehicle.id IN :vehicleIds")
    List<ContactRequest> findByVehicleIds(@Param("vehicleIds") List<Long> vehicleIds);

    /**
     * Find all contact requests created within a date range
     */
    List<ContactRequest> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    /**
     * Find all contact requests that haven't had anonymity expire yet
     */
    @Query("SELECT cr FROM ContactRequest cr WHERE cr.anonymityExpiresAt > CURRENT_TIMESTAMP")
    List<ContactRequest> findWithActiveAnonymity();

    /**
     * Find all contact requests whose anonymity has expired (ready to send buyer confirmation)
     */
    @Query("SELECT cr FROM ContactRequest cr WHERE cr.anonymityExpiresAt <= CURRENT_TIMESTAMP AND cr.emailSentAt IS NULL")
    List<ContactRequest> findReadyForBuyerConfirmation();

    /**
     * Find all contact requests that need dealership notification
     * (created but not yet notified)
     */
    @Query("SELECT cr FROM ContactRequest cr WHERE cr.emailSentAt IS NULL")
    List<ContactRequest> findReadyForDealershipNotification();

    /**
     * Count contact requests for a specific vehicle
     */
    @Query("SELECT COUNT(DISTINCT cr) FROM ContactRequest cr " +
           "JOIN cr.vehicleLinks crv " +
           "WHERE crv.vehicle.id = :vehicleId")
    Long countByVehicleId(@Param("vehicleId") Long vehicleId);
}
