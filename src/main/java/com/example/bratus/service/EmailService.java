package com.example.bratus.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${inquiry.recipient.email:andrijasevic.ante53@gmail.com}")
    private String recipientEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Send a simple text email
     * Note: This method is kept for backward compatibility but won't be used
     * as we're now using FormSubmit.co for the contact form
     *
     * @param to Recipient email address
     * @param subject Email subject
     * @param body Email body content
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            // We won't actually send emails this way anymore
            // mailSender.send(message);

            // Log that we would have sent an email
            System.out.println("Would have sent email to: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
        } catch (Exception e) {
            // Just log the error but don't let it break the application
            System.err.println("Error in dummy email sending: " + e.getMessage());
        }
    }

    /**
     * Returns the recipient email that inquiries should be sent to
     */
    public String getRecipientEmail() {
        return recipientEmail;
    }
}