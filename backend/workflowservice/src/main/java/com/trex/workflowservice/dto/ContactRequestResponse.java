package com.trex.workflowservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for contact request response
 */
public class ContactRequestResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String province;
    private String city;
    private String preferredContactMethod;
    private String additionalComments;
    private LocalDateTime createdAt;
    private LocalDateTime anonymityExpiresAt;
    private List<VehicleDto> selectedVehicles;
    private String status;
    private String nextStep;
    private Map<String, String> errors;

    // Constructors
    public ContactRequestResponse() {
    }

    public ContactRequestResponse(Long id, String fullName, String email, String phone,
                                 String province, String city, String preferredContactMethod,
                                 String additionalComments, LocalDateTime createdAt,
                                 LocalDateTime anonymityExpiresAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.province = province;
        this.city = city;
        this.preferredContactMethod = preferredContactMethod;
        this.additionalComments = additionalComments;
        this.createdAt = createdAt;
        this.anonymityExpiresAt = anonymityExpiresAt;
        this.status = "submitted";
        this.nextStep = "Check your email for dealership follow-up in 30 minutes";
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getAnonymityExpiresAt() {
        return anonymityExpiresAt;
    }

    public void setAnonymityExpiresAt(LocalDateTime anonymityExpiresAt) {
        this.anonymityExpiresAt = anonymityExpiresAt;
    }

    public List<VehicleDto> getSelectedVehicles() {
        return selectedVehicles;
    }

    public void setSelectedVehicles(List<VehicleDto> selectedVehicles) {
        this.selectedVehicles = selectedVehicles;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNextStep() {
        return nextStep;
    }

    public void setNextStep(String nextStep) {
        this.nextStep = nextStep;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

    public void setErrors(Map<String, String> errors) {
        this.errors = errors;
    }

    /**
     * Simple DTO for vehicle information
     */
    public static class VehicleDto {
        public Long id;
        public String makeName;
        public String modelName;
        public Integer year;
        public String colour;
        public String transmission;
        public String fuelType;
        public Integer mileage;
        public java.math.BigDecimal price;

        public VehicleDto() {
        }

        public VehicleDto(Long id, String makeName, String modelName, Integer year,
                         String colour, String transmission, String fuelType,
                         Integer mileage, java.math.BigDecimal price) {
            this.id = id;
            this.makeName = makeName;
            this.modelName = modelName;
            this.year = year;
            this.colour = colour;
            this.transmission = transmission;
            this.fuelType = fuelType;
            this.mileage = mileage;
            this.price = price;
        }
    }
}
