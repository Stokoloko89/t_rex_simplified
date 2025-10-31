package com.trex.workflowservice.scheduler;

import com.trex.workflowservice.model.ContactRequest;
import com.trex.workflowservice.repository.ContactRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DealershipNotificationScheduler
 * Sends immediate email notifications to dealerships when contact requests are created
 * Runs every 10 seconds to catch new requests with minimal latency
 */
@Component
@EnableScheduling
public class DealershipNotificationScheduler {

    @Autowired
    private ContactRequestRepository contactRequestRepository;

    // Email service would be injected here (e.g., @Autowired private EmailService emailService;)
    // For now, this is a placeholder implementation

    /**
     * Send dealership notifications for new contact requests
     * Runs every 10 seconds (fixedRate = 10000 milliseconds)
     * 
     * Business Logic:
     * 1. Find all contact requests where email_sent_at is NULL (not yet notified)
     * 2. For each contact request:
     *    a. Send email to dealership with contact details
     *    b. Include selected vehicle information
     *    c. Update email_sent_at timestamp
     *    d. Log successful notification
     */
    @Scheduled(fixedRate = 10000)
    public void sendDealershipNotifications() {
        try {
            // Find all contact requests ready for dealership notification
            List<ContactRequest> pendingRequests = contactRequestRepository.findReadyForDealershipNotification();

            if (pendingRequests.isEmpty()) {
                return; // No new requests to notify
            }

            for (ContactRequest request : pendingRequests) {
                try {
                    // Send dealership notification email
                    sendDealershipEmail(request);

                    // Mark as sent
                    request.setEmailSentAt(LocalDateTime.now());
                    contactRequestRepository.save(request);

                    System.out.println("✓ Dealership notification sent for contact request ID: " + request.getId());
                } catch (Exception e) {
                    System.err.println("✗ Failed to send dealership notification for contact request ID: " + request.getId());
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Error in dealership notification scheduler:");
            e.printStackTrace();
        }
    }

    /**
     * Send dealership email notification
     * 
     * Email content includes:
     * - Buyer contact details (name, email, phone, preferred contact method)
     * - Location (province, city)
     * - Selected vehicles (make, model, year, price)
     * - Additional comments
     * - Timestamp of request creation
     */
    private void sendDealershipEmail(ContactRequest request) {
        // This would integrate with an email service (e.g., SendGrid, AWS SES, or Spring Mail)
        // For this implementation, we'll prepare the email content
        
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("DEALERSHIP CONTACT REQUEST NOTIFICATION\n");
        emailContent.append("========================================\n\n");
        emailContent.append("New buyer contact request received:\n\n");
        
        emailContent.append("BUYER DETAILS:\n");
        emailContent.append("- Name: ").append(request.getFullName()).append("\n");
        emailContent.append("- Email: ").append(request.getEmail()).append("\n");
        emailContent.append("- Phone: ").append(request.getPhone()).append("\n");
        emailContent.append("- Preferred Contact: ").append(request.getPreferredContactMethod()).append("\n\n");
        
        emailContent.append("LOCATION:\n");
        emailContent.append("- Province: ").append(request.getProvince()).append("\n");
        emailContent.append("- City: ").append(request.getCity()).append("\n\n");
        
        emailContent.append("SELECTED VEHICLES:\n");
        request.getSelectedVehicles().forEach(vehicle -> {
            emailContent.append("- ").append(vehicle.getYear()).append(" ")
                .append(vehicle.getMakeName()).append(" ")
                .append(vehicle.getModelName())
                .append(" (Price: R").append(vehicle.getPrice()).append(")\n");
        });
        
        if (request.getAdditionalComments() != null && !request.getAdditionalComments().isEmpty()) {
            emailContent.append("\nADDITIONAL COMMENTS:\n");
            emailContent.append(request.getAdditionalComments()).append("\n");
        }
        
        emailContent.append("\nRequest Time: ").append(request.getCreatedAt()).append("\n");
        emailContent.append("\nReply directly to the buyer's email or phone number.\n");
        
        // TODO: Integrate with email service to send this email to dealership
        // Example: emailService.sendEmail(dealershipEmail, subject, emailContent.toString());
        
        System.out.println("Dealership Email Content:\n" + emailContent);
    }
}
