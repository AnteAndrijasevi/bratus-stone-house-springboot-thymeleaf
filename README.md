# Dalmatian Stone House - Bratuš Escape

A web application for a family stone house vacation rental in Bratuš, Croatia. The site provides information about the house and amenities, a photo gallery with pinch-to-zoom, guest reviews from Airbnb, availability calendar synced with Airbnb via iCal, and a contact/booking inquiry form.

## 🌐 Live Website

**[bratus-escape.com](https://bratus-escape.com)**

## Tech Stack

- **Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA
- **Frontend:** Thymeleaf, Bootstrap 5, Flatpickr, Pinch-Zoom.js
- **Database:** PostgreSQL (production), H2 (development)
- **Deployment:** Heroku
- **Integrations:** Airbnb iCal calendar sync, FormSubmit.co for inquiry handling

## Features

- **Airbnb Calendar Sync** — Automatically syncs reservations from Airbnb via iCal feed every hour
- **Availability Checker** — Date picker with real-time availability based on synced reservations
- **Booking Inquiry Form** — Sends guest inquiries via FormSubmit.co
- **Photo Gallery** — Responsive image gallery with modal carousel and pinch-to-zoom on mobile
- **Guest Reviews** — Displays Airbnb ratings and selected guest reviews
- **Responsive Design** — Mobile-first layout optimized for travelers browsing on their phones

## Project Structure

```
src/
├── main/
│   ├── java/com/example/bratus/
│   │   ├── config/          # Mail and security configuration
│   │   ├── controller/      # Home, calendar, inquiry controllers
│   │   ├── model/           # Reservation and inquiry models
│   │   ├── repository/      # JPA repositories
│   │   └── service/         # Calendar sync and email services
│   └── resources/
│       ├── static/          # CSS, JS, images, video
│       └── templates/       # Thymeleaf HTML templates
```

## Running Locally

```bash
./gradlew bootRun
```

The app will be available at `http://localhost:8080`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JDBC_DATABASE_URL` | PostgreSQL connection URL |
| `AIRBNB_ICAL_URL` | Airbnb iCal feed URL |
| `MAIL_USERNAME` | Email for sending notifications |
| `MAIL_PASSWORD` | Email app password |
| `INQUIRY_EMAIL` | Email to receive booking inquiries |
