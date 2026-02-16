package com.example.bratus.service;


import com.example.bratus.model.Reservation;
import com.example.bratus.repository.ReservationRepository;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.Summary;
import net.fortuna.ical4j.model.property.Location;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class CalendarSyncService {



    private final ReservationRepository reservationRepository;

    @Value("${airbnb.ical.url}")
    private String airbnbIcalUrl;

    public CalendarSyncService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Scheduled(fixedRate = 3600000) // Izvršava se svakih sat vremena
    public void syncCalendar() {
        try {
            System.out.println("Pokrećem sinkronizaciju s Airbnb iCal...");
            System.out.println("Airbnb iCal URL: " + airbnbIcalUrl);

            List<Reservation> existingBefore = reservationRepository.findAll();
            System.out.println("Trenutne rezervacije u bazi (" + existingBefore.size() + "):");
            for (Reservation r : existingBefore) {
                System.out.println("ID: " + r.getId() + " | " + r.getStartDate() + " - " + r.getEndDate() + " | " + r.getGuestName());
            }

            URL url = new URL(airbnbIcalUrl);
            CalendarBuilder builder = new CalendarBuilder();
            Calendar calendar = builder.build(url.openStream());

            System.out.println("iCal učitan: " + calendar.getProductId());
            System.out.println("Broj komponenti: " + calendar.getComponents().size());

            int eventCount = 0;
            int newEventsCount = 0;

            for (Component component : calendar.getComponents()) {
                if (component instanceof VEvent event) {
                    eventCount++;

                    Date start = event.getStartDate().getDate();
                    Date end = event.getEndDate().getDate();

                    LocalDate startDate = convertToLocalDate(start);
                    LocalDate endDate = convertToLocalDate(end);

                    Summary summary = event.getSummary();
                    Location location = event.getLocation();
                    String guestName = summary != null ? summary.getValue() : "Airbnb Guest";

                    System.out.println("Događaj #" + eventCount + ": " + startDate + " - " + endDate + " | " + guestName);

                    List<Reservation> existing = reservationRepository.findAll();
                    boolean alreadyExists = existing.stream().anyMatch(r ->
                            r.getStartDate().equals(startDate) && r.getEndDate().equals(endDate)
                    );

                    if (!alreadyExists) {
                        Reservation reservation = new Reservation(
                                startDate, endDate, guestName
                        );
                        reservationRepository.save(reservation);
                        System.out.println("  > Nova rezervacija dodana: " + startDate + " - " + endDate);
                        newEventsCount++;
                    } else {
                        System.out.println("  > Rezervacija već postoji, preskačem");
                    }
                } else {
                    System.out.println("Komponenta nije VEvent: " + component.getName());
                }
            }

            System.out.println("Ukupno VEvent događaja u iCal: " + eventCount);
            System.out.println("Novih rezervacija dodano: " + newEventsCount);

            List<Reservation> existingAfter = reservationRepository.findAll();
            System.out.println("Rezervacije nakon sinkronizacije (" + existingAfter.size() + "):");
            for (Reservation r : existingAfter) {
                System.out.println("ID: " + r.getId() + " | " + r.getStartDate() + " - " + r.getEndDate() + " | " + r.getGuestName());
            }

            LocalDate checkDate = LocalDate.of(2025, 4, 27);
            boolean hasReservationOn27th = existingAfter.stream().anyMatch(r ->
                    (!checkDate.isBefore(r.getStartDate()) && !checkDate.isAfter(r.getEndDate()))
            );
            System.out.println("Rezervacija za 27.4.2025: " + (hasReservationOn27th ? "DA" : "NE"));

            System.out.println("Sinkronizacija završena.");
        } catch (Exception e) {
            System.err.println("Dogodila se greška pri sinkronizaciji iCal-a: " + e.getMessage());
            e.printStackTrace();
        }
    }


    private LocalDate convertToLocalDate(Date date) {
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(date);
        LocalDate converted = LocalDate.of(
                cal.get(java.util.Calendar.YEAR),
                cal.get(java.util.Calendar.MONTH) + 1,
                cal.get(java.util.Calendar.DAY_OF_MONTH)
        );
        System.out.println("Date conversion (direct): " + date + " -> " + converted);
        return converted;
    }
}
