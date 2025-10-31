package com.trex.workflowservice.controller;

import com.trex.workflowservice.dto.ContactRequestCreateRequest;
import com.trex.workflowservice.dto.ContactRequestResponse;
import com.trex.workflowservice.model.ContactRequest;
import com.trex.workflowservice.model.Vehicle;
import com.trex.workflowservice.repository.ContactRequestRepository;
import com.trex.workflowservice.repository.VehicleRepository;
import com.trex.workflowservice.service.ContactRequestValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ContactRequestController
 * Handles HTTP endpoints for contact request operations
 */
@RestController
@RequestMapping("/api/contact-requests")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ContactRequestController {

    @Autowired
    private ContactRequestRepository contactRequestRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * POST /api/contact-requests
     * Create a new contact request with selected vehicles
     */
    @PostMapping
    public ResponseEntity<?> createContactRequest(@RequestBody ContactRequestCreateRequest request) {
        // Validate request
        Map<String, String> validationErrors = ContactRequestValidationService.validateContactRequest(
            request.getFullName(),
            request.getEmail(),
            request.getPhone(),
            request.getProvince(),
            request.getCity(),
            request.getPreferredContactMethod(),
            request.getAdditionalComments(),
            request.getVehicleIds()
        );

        // Return 422 with validation errors if any
        if (!validationErrors.isEmpty()) {
            ContactRequestResponse errorResponse = new ContactRequestResponse();
            errorResponse.setErrors(validationErrors);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorResponse);
        }

        // Verify all vehicles exist
        List<Vehicle> vehicles = vehicleRepository.findAllById(request.getVehicleIds());
        if (vehicles.size() != request.getVehicleIds().size()) {
            Map<String, String> errors = Map.of("selectedVehicles", "One or more selected vehicles are no longer available");
            ContactRequestResponse errorResponse = new ContactRequestResponse();
            errorResponse.setErrors(errors);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorResponse);
        }

        // Create contact request
        ContactRequest contactRequest = new ContactRequest(
            request.getFullName().trim(),
            request.getEmail().trim(),
            request.getPhone().trim(),
            request.getProvince(),
            request.getCity(),
            request.getPreferredContactMethod(),
            request.getAdditionalComments() != null ? request.getAdditionalComments().trim() : null
        );

        // Add selected vehicles
        for (int i = 0; i < vehicles.size(); i++) {
            contactRequest.addVehicle(vehicles.get(i));
        }

        // Save contact request
        ContactRequest saved = contactRequestRepository.save(contactRequest);

        // Build response
        ContactRequestResponse response = new ContactRequestResponse(
            saved.getId(),
            saved.getFullName(),
            saved.getEmail(),
            saved.getPhone(),
            saved.getProvince(),
            saved.getCity(),
            saved.getPreferredContactMethod(),
            saved.getAdditionalComments(),
            saved.getCreatedAt(),
            saved.getAnonymityExpiresAt()
        );

        // Map selected vehicles to DTOs
        List<ContactRequestResponse.VehicleDto> vehicleDtos = saved.getSelectedVehicles().stream()
            .map(v -> new ContactRequestResponse.VehicleDto(
                v.getId(),
                v.getMakeName(),
                v.getModelName(),
                v.getYear(),
                v.getColour(),
                v.getTransmission(),
                v.getFuelType(),
                v.getMileage(),
                v.getPrice()
            ))
            .toList();

        response.setSelectedVehicles(vehicleDtos);
        response.setStatus("submitted");
        response.setNextStep("Check your email for dealership follow-up in 30 minutes");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/contact-requests/{id}
     * Retrieve a contact request by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getContactRequest(@PathVariable Long id) {
        Optional<ContactRequest> optional = contactRequestRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ContactRequest contactRequest = optional.get();
        ContactRequestResponse response = new ContactRequestResponse(
            contactRequest.getId(),
            contactRequest.getFullName(),
            contactRequest.getEmail(),
            contactRequest.getPhone(),
            contactRequest.getProvince(),
            contactRequest.getCity(),
            contactRequest.getPreferredContactMethod(),
            contactRequest.getAdditionalComments(),
            contactRequest.getCreatedAt(),
            contactRequest.getAnonymityExpiresAt()
        );

        // Map selected vehicles to DTOs
        List<ContactRequestResponse.VehicleDto> vehicleDtos = contactRequest.getSelectedVehicles().stream()
            .map(v -> new ContactRequestResponse.VehicleDto(
                v.getId(),
                v.getMakeName(),
                v.getModelName(),
                v.getYear(),
                v.getColour(),
                v.getTransmission(),
                v.getFuelType(),
                v.getMileage(),
                v.getPrice()
            ))
            .toList();

        response.setSelectedVehicles(vehicleDtos);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/contact-requests/by-vehicle/{vehicleId}
     * Retrieve all contact requests for a specific vehicle
     */
    @GetMapping("/by-vehicle/{vehicleId}")
    public ResponseEntity<List<ContactRequestResponse>> getContactRequestsByVehicle(@PathVariable Long vehicleId) {
        List<ContactRequest> requests = contactRequestRepository.findByVehicleId(vehicleId);

        List<ContactRequestResponse> responses = requests.stream()
            .map(cr -> new ContactRequestResponse(
                cr.getId(),
                cr.getFullName(),
                cr.getEmail(),
                cr.getPhone(),
                cr.getProvince(),
                cr.getCity(),
                cr.getPreferredContactMethod(),
                cr.getAdditionalComments(),
                cr.getCreatedAt(),
                cr.getAnonymityExpiresAt()
            ))
            .toList();

        return ResponseEntity.ok(responses);
    }
}
