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
 * BuyerConfirmationScheduler
 * Sends buyer confirmation emails 30 minutes after contact request creation
 * Confirms receipt without revealing dealership contact information
 * Runs every minute to ensure timely delivery
 */
@Component
@EnableScheduling
public class BuyerConfirmationScheduler {

    @Autowired
    private ContactRequestRepository contactRequestRepository;

    // Email service would be injected here (e.g., @Autowired private EmailService emailService;)
    // For now, this is a placeholder implementation

    /**
     * Send buyer confirmation emails when anonymity period expires
     * Runs every 60 seconds (fixedRate = 60000 milliseconds)
     * 
     * Business Logic:
     * 1. Find all contact requests where anonymity_expires_at <= CURRENT_TIMESTAMP
     *    AND email_sent_at is NOT NULL (dealership was notified)
     * 2. For each contact request:
     *    a. Send confirmation email to buyer
     *    b. Include confirmation message and next steps
     *    c. Do NOT include any dealership contact information
     *    d. Indicate that dealership will contact them per preferred method
     */
    @Scheduled(fixedRate = 60000)
    public void sendBuyerConfirmations() {
        try {
            // Find all contact requests ready for buyer confirmation
            // (Anonymity expired and dealership was already notified)
            List<ContactRequest> readyRequests = contactRequestRepository.findReadyForBuyerConfirmation();

            if (readyRequests.isEmpty()) {
                return; // No requests ready for confirmation
            }

            for (ContactRequest request : readyRequests) {
                try {
                    // Send buyer confirmation email
                    sendBuyerConfirmationEmail(request);

                    // Update request to mark confirmation as sent
                    request.setUpdatedAt(LocalDateTime.now());
                    contactRequestRepository.save(request);

                    System.out.println("✓ Buyer confirmation email sent for contact request ID: " + request.getId());
                } catch (Exception e) {
                    System.err.println("✗ Failed to send buyer confirmation for contact request ID: " + request.getId());
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            System.err.println("Error in buyer confirmation scheduler:");
            e.printStackTrace();
        }
    }

    /**
     * Send buyer confirmation email
     * 
     * Email content includes:
     * - Confirmation of request receipt (30 minutes after initial submission)
     * - Summary of selected vehicles
     * - Confirmation of contact method and details
     * - Message that dealership will reach out per preferred method
     * - No dealership contact information revealed (maintains buyer anonymity)
     * - Next steps and what to expect
     */
    private void sendBuyerConfirmationEmail(ContactRequest request) {
        // This would integrate with an email service (e.g., SendGrid, AWS SES, or Spring Mail)
        
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("THANK YOU - CONTACT REQUEST CONFIRMED\n");
        emailContent.append("======================================\n\n");
        emailContent.append("Hello ").append(request.getFullName()).append(",\n\n");
        
        emailContent.append("We have received your contact request and confirmed it with our dealership.\n\n");
        
        emailContent.append("SELECTED VEHICLES:\n");
        int[] index = {1};
        request.getSelectedVehicles().forEach(vehicle -> {
            emailContent.append(index[0]++).append(". ")
                .append(vehicle.getYear()).append(" ")
                .append(vehicle.getMakeName()).append(" ")
                .append(vehicle.getModelName())
                .append(" (R").append(vehicle.getPrice()).append(")\n");
        });
        
        emailContent.append("\nYOUR CONTACT INFORMATION:\n");
        emailContent.append("- Location: ").append(request.getCity()).append(", ")
            .append(request.getProvince()).append("\n");
        emailContent.append("- Preferred Contact: ").append(formatContactMethod(request.getPreferredContactMethod()))
            .append("\n\n");
        
        emailContent.append("WHAT HAPPENS NEXT:\n");
        emailContent.append("A dealership representative will contact you via ")
            .append(request.getPreferredContactMethod()).append(" ");
        if ("email".equals(request.getPreferredContactMethod())) {
            emailContent.append("at the email address you provided.");
        } else if ("phone".equals(request.getPreferredContactMethod())) {
            emailContent.append("at the phone number you provided.");
        } else if ("whatsapp".equals(request.getPreferredContactMethod())) {
            emailContent.append("via WhatsApp at the phone number you provided.");
        }
        emailContent.append("\n\n");
        
        emailContent.append("You can expect to hear from them within 24-48 hours during business days.\n\n");
        
        emailContent.append("IMPORTANT:\n");
        emailContent.append("Please do not share this request with multiple dealerships.\n");
        emailContent.append("Each dealership will respond independently to your inquiry.\n\n");
        
        emailContent.append("Questions? Please reply to this email.\n\n");
        emailContent.append("Best regards,\n");
        emailContent.append("T-Rex Auto Sales Team\n");
        
        // TODO: Integrate with email service to send this email to buyer
        // Example: emailService.sendEmail(request.getEmail(), "Your Contact Request Confirmed", emailContent.toString());
        
        System.out.println("Buyer Confirmation Email Content:\n" + emailContent);
    }

    /**
     * Format contact method for human-readable display
     */
    private String formatContactMethod(String method) {
        return switch (method.toLowerCase()) {
            case "email" -> "Email";
            case "phone" -> "Phone";
            case "whatsapp" -> "WhatsApp";
            default -> method;
        };
    }
}
