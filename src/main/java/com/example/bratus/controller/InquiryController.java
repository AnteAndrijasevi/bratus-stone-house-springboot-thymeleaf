package com.example.bratus.controller;

import com.example.bratus.model.Inquiry;
import com.example.bratus.repository.ReservationRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

@RestController
@RequestMapping("/calendar")
public class InquiryController {

    private final ReservationRepository reservationRepository;

    public InquiryController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    /**
     * Handle guest inquiry submission
     */
    @PostMapping("/inquiry")
    public Map<String, String> handleInquiry(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam("guestName") String guestName,
            @RequestParam("guestEmail") String guestEmail,
            @RequestParam(value = "guestPhone", required = false) String guestPhone,
            @RequestParam(value = "guestMessage", required = false) String guestMessage
    ) {
        Map<String, String> response = new HashMap<>();

        try {
            // Create inquiry object
            Inquiry inquiry = new Inquiry();
            inquiry.setStartDate(startDate);
            inquiry.setEndDate(endDate);
            inquiry.setGuestName(guestName);
            inquiry.setGuestEmail(guestEmail);
            inquiry.setGuestPhone(guestPhone != null ? guestPhone : "Not provided");
            inquiry.setGuestMessage(guestMessage != null ? guestMessage : "No message");
            inquiry.setCreatedAt(LocalDate.now());

            // Check availability (optional)
            boolean overlaps = reservationRepository.findAll().stream().anyMatch(r ->
                    startDate.isBefore(r.getEndDate()) &&
                            endDate.isAfter(r.getStartDate())
            );

            // Save inquiry to a file instead of sending email
            saveInquiryToFile(inquiry, overlaps);

            // Log the inquiry
            System.out.println("Received inquiry from: " + guestName + " (" + guestEmail + ")");
            System.out.println("Dates: " + startDate + " to " + endDate);
            System.out.println("Availability: " + (overlaps ? "Dates overlap with existing reservations" : "Dates appear to be available"));

            response.put("status", "success");
            response.put("message", "Your inquiry has been sent successfully. We will contact you shortly!");

        } catch (Exception e) {
            e.printStackTrace();
            response.put("status", "error");
            response.put("message", "An error occurred processing your inquiry: " + e.getMessage());
        }

        return response;
    }

    /**
     * Save inquiry to a file
     */
    private void saveInquiryToFile(Inquiry inquiry, boolean overlaps) {
        try {
            // Create directory if it doesn't exist
            Files.createDirectories(Paths.get("inquiries"));

            // Create a file with timestamp to avoid overwriting
            String filename = "inquiries/inquiry_" + System.currentTimeMillis() + ".txt";

            StringBuilder content = new StringBuilder();
            content.append("NEW BOOKING INQUIRY\n");
            content.append("=================\n\n");
            content.append("Guest: ").append(inquiry.getGuestName()).append("\n");
            content.append("Email: ").append(inquiry.getGuestEmail()).append("\n");
            content.append("Phone: ").append(inquiry.getGuestPhone()).append("\n\n");
            content.append("Dates: ").append(inquiry.getStartDate()).append(" to ").append(inquiry.getEndDate()).append("\n");

            int nights = (int) (inquiry.getEndDate().toEpochDay() - inquiry.getStartDate().toEpochDay());
            content.append("Nights: ").append(nights).append("\n\n");

            if (overlaps) {
                content.append("WARNING: These dates overlap with existing reservations!\n\n");
            } else {
                content.append("These dates appear to be available.\n\n");
            }

            content.append("Guest Message:\n").append(inquiry.getGuestMessage()).append("\n\n");
            content.append("This inquiry was received on ").append(inquiry.getCreatedAt()).append(".");

            // Write to file
            Files.write(Paths.get(filename), content.toString().getBytes(), StandardOpenOption.CREATE);

            System.out.println("Inquiry saved to file: " + filename);

        } catch (IOException e) {
            System.err.println("Error saving inquiry to file: " + e.getMessage());
        }
    }
}