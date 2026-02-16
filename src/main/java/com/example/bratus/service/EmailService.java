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

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);



            System.out.println("Would have sent email to: " + to);
            System.out.println("Subject: " + subject);
            System.out.println("Body: " + body);
        } catch (Exception e) {
            System.err.println("Error in dummy email sending: " + e.getMessage());
        }
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }
}