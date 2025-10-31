package com.trex.workflowservice.model;

import jakarta.persistence.*;

/**
 * ContactRequestVehicle Junction Entity
 * Maps contact requests to vehicles (Many-to-Many relationship)
 */
@Entity
@Table(name = "contact_request_vehicles",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"contact_request_id", "vehicle_id"})})
public class ContactRequestVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "contact_request_id", nullable = false)
    private ContactRequest contactRequest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "sequence", nullable = false)
    private Integer sequence; // Order of vehicle selection (1-4)

    // Constructors
    public ContactRequestVehicle() {
    }

    public ContactRequestVehicle(ContactRequest contactRequest, Vehicle vehicle) {
        this.contactRequest = contactRequest;
        this.vehicle = vehicle;
        this.sequence = 0; // Will be set by service
    }

    public ContactRequestVehicle(ContactRequest contactRequest, Vehicle vehicle, Integer sequence) {
        this.contactRequest = contactRequest;
        this.vehicle = vehicle;
        this.sequence = sequence;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ContactRequest getContactRequest() {
        return contactRequest;
    }

    public void setContactRequest(ContactRequest contactRequest) {
        this.contactRequest = contactRequest;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Integer getSequence() {
        return sequence;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }
}
