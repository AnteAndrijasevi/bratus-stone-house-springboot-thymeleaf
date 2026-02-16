package com.example.bratus.controller;

import com.example.bratus.model.Reservation;
import com.example.bratus.repository.ReservationRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/calendar")
public class CalendarController {

    private final ReservationRepository reservationRepository;

    public CalendarController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping
    public String showCalendar(Model model) {
        List<Reservation> reservations = reservationRepository.findAll();
        model.addAttribute("reservations", reservations);
        return "calendar";
    }

    @PostMapping("/check-availability")
    @ResponseBody
    public Map<String, Boolean> checkAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        boolean isAvailable = isDateRangeAvailable(startDate, endDate);
        return Map.of("available", isAvailable);
    }

    @GetMapping("/dates")
    @ResponseBody
    public List<Map<String, String>> getReservedDates() {
        return reservationRepository.findAll()
                .stream()
                .map(reservation -> Map.of(
                        "from", reservation.getStartDate().toString(),
                        "to", reservation.getEndDate().minusDays(1).toString()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping("/reserve")
    @ResponseBody
    public Map<String, String> createReservation(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate")   @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam("guestName") String guestName
    ) {
        Map<String, String> response = new HashMap<>();

        boolean overlaps = reservationRepository.findAll().stream().anyMatch(r ->
                startDate.isBefore(r.getEndDate()) &&
                        endDate.isAfter(r.getStartDate())
        );

        if (overlaps) {
            response.put("status", "error");
            response.put("message", "Već postoji rezervacija koja se preklapa s odabranim datumima.");
            return response;
        }

        Reservation reservation = new Reservation();
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setGuestName(guestName);

        reservationRepository.save(reservation);

        response.put("status", "success");
        response.put("message", "Rezervacija je uspješno kreirana.");
        return response;
    }

    private boolean isDateRangeAvailable(LocalDate startDate, LocalDate endDate) {
        List<Reservation> existingReservations = reservationRepository.findAll();

        return existingReservations.stream().noneMatch(existing -> {

            return startDate.isBefore(existing.getEndDate()) &&
                    endDate.isAfter(existing.getStartDate());
        });
    }
}