package com.trex.workflowservice.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * ContactRequestValidationService
 * Validates contact request form fields according to business rules
 */
public class ContactRequestValidationService {

    // Validation patterns
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s'-]+$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}$"
    );
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^\\+[0-9]{1,3}\\s?[0-9\\s-]{6,15}$"
    );

    /**
     * Validate full name
     * Rules: 2-255 characters, only letters, spaces, hyphens, apostrophes
     */
    public static String validateFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return "Full name is required";
        }

        fullName = fullName.trim();

        if (fullName.length() < 2) {
            return "Full name must be at least 2 characters";
        }

        if (fullName.length() > 255) {
            return "Full name must not exceed 255 characters";
        }

        if (!NAME_PATTERN.matcher(fullName).matches()) {
            return "Full name can only contain letters, spaces, hyphens, or apostrophes";
        }

        return null; // Valid
    }

    /**
     * Validate email
     * Rules: RFC 5322 format
     */
    public static String validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return "Email is required";
        }

        email = email.trim();

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return "Please enter a valid email address (e.g., name@example.com)";
        }

        if (email.length() > 254) {
            return "Email must not exceed 254 characters";
        }

        return null; // Valid
    }

    /**
     * Validate phone number
     * Rules: E.164 international format (e.g., +27 83 456 7890, +1 555 123 4567)
     */
    public static String validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return "Phone number is required";
        }

        phone = phone.trim();

        if (!PHONE_PATTERN.matcher(phone).matches()) {
            return "Phone must include country code (e.g., +27 83 456 7890 for South Africa)";
        }

        return null; // Valid
    }

    /**
     * Validate province selection
     * Rules: Must be a non-empty string matching expected province values
     */
    public static String validateProvince(String province) {
        if (province == null || province.trim().isEmpty()) {
            return "Province is required";
        }

        province = province.trim();

        if (province.length() > 100) {
            return "Province name must not exceed 100 characters";
        }

        return null; // Valid (actual value validation done via dropdown in backend)
    }

    /**
     * Validate city selection
     * Rules: Must be a non-empty string matching expected city values for province
     */
    public static String validateCity(String city) {
        if (city == null || city.trim().isEmpty()) {
            return "City is required";
        }

        city = city.trim();

        if (city.length() > 100) {
            return "City name must not exceed 100 characters";
        }

        return null; // Valid (actual value validation done via dropdown in backend)
    }

    /**
     * Validate preferred contact method
     * Rules: Must be "email", "phone", or "whatsapp"
     */
    public static String validatePreferredContactMethod(String method) {
        if (method == null || method.trim().isEmpty()) {
            return "Preferred contact method is required";
        }

        method = method.trim();

        if (!List.of("email", "phone", "whatsapp").contains(method.toLowerCase())) {
            return "Preferred contact method must be 'email', 'phone', or 'whatsapp'";
        }

        return null; // Valid
    }

    /**
     * Validate additional comments
     * Rules: Optional field, max 1000 characters
     */
    public static String validateAdditionalComments(String comments) {
        if (comments == null) {
            return null; // Optional field
        }

        if (comments.length() > 1000) {
            return "Additional comments must not exceed 1000 characters";
        }

        return null; // Valid
    }

    /**
     * Validate selected vehicles
     * Rules: 1-4 vehicles required
     */
    public static String validateSelectedVehicles(List<Long> vehicleIds) {
        if (vehicleIds == null || vehicleIds.isEmpty()) {
            return "Please select at least 1 vehicle";
        }

        if (vehicleIds.size() > 4) {
            return "You can select a maximum of 4 vehicles";
        }

        return null; // Valid
    }

    /**
     * Validate the entire contact request payload
     * Returns a map of field names to error messages (empty if all valid)
     */
    public static Map<String, String> validateContactRequest(
            String fullName,
            String email,
            String phone,
            String province,
            String city,
            String preferredContactMethod,
            String additionalComments,
            List<Long> vehicleIds) {

        Map<String, String> errors = new HashMap<>();

        String nameError = validateFullName(fullName);
        if (nameError != null) {
            errors.put("fullName", nameError);
        }

        String emailError = validateEmail(email);
        if (emailError != null) {
            errors.put("email", emailError);
        }

        String phoneError = validatePhone(phone);
        if (phoneError != null) {
            errors.put("phone", phoneError);
        }

        String provinceError = validateProvince(province);
        if (provinceError != null) {
            errors.put("province", provinceError);
        }

        String cityError = validateCity(city);
        if (cityError != null) {
            errors.put("city", cityError);
        }

        String methodError = validatePreferredContactMethod(preferredContactMethod);
        if (methodError != null) {
            errors.put("preferredContactMethod", methodError);
        }

        String commentsError = validateAdditionalComments(additionalComments);
        if (commentsError != null) {
            errors.put("additionalComments", commentsError);
        }

        String vehiclesError = validateSelectedVehicles(vehicleIds);
        if (vehiclesError != null) {
            errors.put("selectedVehicles", vehiclesError);
        }

        return errors;
    }
}
