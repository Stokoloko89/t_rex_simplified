package com.trex.workflowservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ContactRequest Entity
 * Represents a buyer's contact request with selected vehicles
 */
@Entity
@Table(name = "contact_requests")
public class ContactRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, unique = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false, length = 100)
    private String province;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(name = "preferred_contact_method", nullable = false, length = 20)
    private String preferredContactMethod; // "email", "phone", "whatsapp"

    @Column(columnDefinition = "TEXT")
    private String additionalComments;

    @Column(name = "anonymity_expires_at")
    private LocalDateTime anonymityExpiresAt; // 30 minutes after creation for buyer privacy

    @Column(name = "email_sent_at")
    private LocalDateTime emailSentAt; // timestamp when dealership notification was sent

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Many-to-Many relationship with vehicles through junction table
    @OneToMany(mappedBy = "contactRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactRequestVehicle> vehicleLinks = new ArrayList<>();

    // Constructors
    public ContactRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        // Set anonymity expiration to 30 minutes from now
        this.anonymityExpiresAt = LocalDateTime.now().plusMinutes(30);
    }

    public ContactRequest(String fullName, String email, String phone, String province, String city,
                         String preferredContactMethod, String additionalComments) {
        this();
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.province = province;
        this.city = city;
        this.preferredContactMethod = preferredContactMethod;
        this.additionalComments = additionalComments;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getPreferredContactMethod() {
        return preferredContactMethod;
    }

    public void setPreferredContactMethod(String preferredContactMethod) {
        this.preferredContactMethod = preferredContactMethod;
    }

    public String getAdditionalComments() {
        return additionalComments;
    }

    public void setAdditionalComments(String additionalComments) {
        this.additionalComments = additionalComments;
    }

    public LocalDateTime getAnonymityExpiresAt() {
        return anonymityExpiresAt;
    }

    public void setAnonymityExpiresAt(LocalDateTime anonymityExpiresAt) {
        this.anonymityExpiresAt = anonymityExpiresAt;
    }

    public LocalDateTime getEmailSentAt() {
        return emailSentAt;
    }

    public void setEmailSentAt(LocalDateTime emailSentAt) {
        this.emailSentAt = emailSentAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ContactRequestVehicle> getVehicleLinks() {
        return vehicleLinks;
    }

    public void setVehicleLinks(List<ContactRequestVehicle> vehicleLinks) {
        this.vehicleLinks = vehicleLinks;
    }

    /**
     * Add a vehicle to this contact request
     */
    public void addVehicle(Vehicle vehicle) {
        ContactRequestVehicle link = new ContactRequestVehicle(this, vehicle);
        vehicleLinks.add(link);
    }

    /**
     * Remove a vehicle from this contact request
     */
    public void removeVehicle(Vehicle vehicle) {
        vehicleLinks.removeIf(link -> link.getVehicle().getId().equals(vehicle.getId()));
    }

    /**
     * Get the list of selected vehicles
     */
    public List<Vehicle> getSelectedVehicles() {
        return vehicleLinks.stream()
                .map(ContactRequestVehicle::getVehicle)
                .toList();
    }

    /**
     * Update timestamp before persistence
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
