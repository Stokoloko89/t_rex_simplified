package com.trex.workflowservice.dto;

import java.util.List;

/**
 * DTO for creating a new contact request
 */
public class ContactRequestCreateRequest {
    private String fullName;
    private String email;
    private String phone;
    private String province;
    private String city;
    private String preferredContactMethod; // "email", "phone", "whatsapp"
    private String additionalComments;
    private List<Long> vehicleIds; // 1-4 vehicle IDs

    // Constructors
    public ContactRequestCreateRequest() {
    }

    public ContactRequestCreateRequest(String fullName, String email, String phone,
                                      String province, String city, String preferredContactMethod,
                                      String additionalComments, List<Long> vehicleIds) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.province = province;
        this.city = city;
        this.preferredContactMethod = preferredContactMethod;
        this.additionalComments = additionalComments;
        this.vehicleIds = vehicleIds;
    }

    // Getters and Setters
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

    public List<Long> getVehicleIds() {
        return vehicleIds;
    }

    public void setVehicleIds(List<Long> vehicleIds) {
        this.vehicleIds = vehicleIds;
    }
}
