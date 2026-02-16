// Navbar scroll effect
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
});

// Hero video scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.querySelector('.hero-video');
    const gallerySection = document.getElementById('gallery');
    const detailsSection = document.getElementById('details');
    const amenitiesSection = document.getElementById('amenities');
    const bookingSection = document.getElementById('booking');

    function handleVideoVisibility() {
        const scrollY = window.scrollY;
        const galleryTop = gallerySection?.offsetTop;
        const galleryBottom = gallerySection ? gallerySection.offsetTop + gallerySection.offsetHeight : 0;
        const detailsTop = detailsSection?.offsetTop;

        // Hide video after hero section until gallery
        if (heroVideo && gallerySection && detailsSection) {
            if (scrollY < detailsTop || (scrollY >= galleryTop && scrollY <= galleryBottom)) {
                heroVideo.style.opacity = '1';
            } else {
                heroVideo.style.opacity = '0';
            }
        }
    }

    window.addEventListener('scroll', handleVideoVisibility);
    handleVideoVisibility(); // Initial check
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
            }
        });
    });
});

// Pinch-to-zoom for gallery modal
document.addEventListener('DOMContentLoaded', function() {
    const carouselModal = document.getElementById('carouselModal');
    if (!carouselModal) return;

    let pinchZoomInstances = [];

    carouselModal.addEventListener('shown.bs.modal', function() {
        document.querySelectorAll('.pinch-zoom-container').forEach(container => {
            if (!container.dataset.pinchZoomInit) {
                const pz = new PinchZoom(container, {
                    draggableUnzoomed: false,
                    minZoom: 1,
                    maxZoom: 4,
                    tapZoomFactor: 2
                });
                pinchZoomInstances.push(pz);
                container.dataset.pinchZoomInit = 'true';
            }
        });
    });

    const carousel = document.getElementById('carouselExample');
    if (carousel) {
        carousel.addEventListener('slide.bs.carousel', function() {
            pinchZoomInstances.forEach(pz => pz.zoomOutAnimation());
        });
    }
});

// Gallery carousel function
// Gallery carousel function - improved version
function openCarousel(index) {
    // Get the modal and initialize it
    const carouselModal = new bootstrap.Modal(document.getElementById('carouselModal'));

    // Get all carousel items
    const carouselItems = document.querySelectorAll('#carouselExample .carousel-item');

    // Remove active class from all items
    carouselItems.forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to the selected item by index
    if (index < carouselItems.length) {
        carouselItems[index].classList.add('active');
    } else {
        // If index is out of bounds, default to first image
        carouselItems[0].classList.add('active');
        console.warn(`Carousel index ${index} out of bounds, defaulting to first image`);
    }

    // Show the modal
    carouselModal.show();
}

// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate gallery items
    animateGallery();

    // Animation elements
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    const stoneSection = document.querySelector('.section-stone');

    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }

    // Add appear class to elements in viewport
    function checkScroll() {
        fadeElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('appear');
            }
        });

        // Reveal stone pattern
        if (stoneSection && isElementInViewport(stoneSection)) {
            stoneSection.classList.add('reveal');
        }
    }

    // Check elements on page load
    checkScroll();

    // Check elements on scroll
    window.addEventListener('scroll', checkScroll);

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Gallery animation function
function animateGallery() {
    const galleryItems = document.querySelectorAll('.photo-gallery img');

    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
        }, 100 * index);
    });
}

// Calendar and booking functionality
document.addEventListener('DOMContentLoaded', function() {
    let reservedDates = [];

    // Fetch reserved dates from backend
    fetch('/calendar/dates')
        .then(response => response.json())
        .then(dates => {
            reservedDates = dates;
            initializeDatePickers();
        })
        .catch(error => {
            console.error('Error fetching reservation dates:', error);
            // Fallback - initialize with empty reserved dates
            reservedDates = [];
            initializeDatePickers();

            // Optionally show a non-intrusive warning to the user
            const availabilityMessage = document.getElementById('availability-message');
            if (availabilityMessage) {
                availabilityMessage.innerHTML = '<div class="text-warning"><i class="fas fa-exclamation-triangle"></i> Could not load availability data. Please contact us directly.</div>';
            }
        });

    function initializeDatePickers() {
        const config = {
            minDate: "today",
            disable: getDisabledRanges(),
            dateFormat: "Y-m-d",
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                },
                months: {
                    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    longhand: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                }
            }
        };

        const checkInPicker = flatpickr("#check-in", {
            ...config,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    // Update hidden field for form submission
                    const startDateField = document.getElementById('startDate');
                    if (startDateField) {
                        startDateField.value = selectedDates[0].toISOString().split('T')[0];
                    }

                    const checkOutElement = document.getElementById('check-out');
                    if (checkOutElement && checkOutElement._flatpickr) {
                        checkOutElement._flatpickr.set('minDate', selectedDates[0]);
                    }
                    updateAvailability();
                }
            }
        });

        const checkOutPicker = flatpickr("#check-out", {
            ...config,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    // Update hidden field for form submission
                    const endDateField = document.getElementById('endDate');
                    if (endDateField) {
                        endDateField.value = selectedDates[0].toISOString().split('T')[0];
                    }

                    const checkInElement = document.getElementById('check-in');
                    if (checkInElement && checkInElement._flatpickr) {
                        checkInElement._flatpickr.set('maxDate', selectedDates[0]);
                    }
                    updateAvailability();
                }
            }
        });
    }

    function getDisabledRanges() {
        console.log('Building disabled ranges from:', reservedDates); // Debug log

        const disabledRanges = reservedDates.map(r => {
            const fromDate = new Date(r.from);
            const toDate = new Date(r.to);


            const range = {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            };

            console.log('Disabled range:', range); // Debug log
            return range;
        });

        return disabledRanges;
    }

    function updateAvailability() {
        const checkIn = document.getElementById('check-in')?.value;
        const checkOut = document.getElementById('check-out')?.value;
        const availabilityMessage = document.getElementById('availability-message');
        const startDateField = document.getElementById('startDate');
        const endDateField = document.getElementById('endDate');

        if (checkIn && checkOut && startDateField && endDateField) {
            // Update hidden fields for form
            startDateField.value = checkIn;
            endDateField.value = checkOut;

            // Check if dates are available
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            const isConflict = reservedDates.some(r => {
                const reservedStart = new Date(r.from);
                const reservedEnd = new Date(r.to);

                return (checkInDate <= reservedEnd && checkOutDate >= reservedStart);
            });

            if (availabilityMessage) {
                if (isConflict) {
                    availabilityMessage.innerHTML = '<div class="text-danger"><i class="fas fa-times-circle"></i> These dates are not available. Please select different dates.</div>';
                    availabilityMessage.classList.add('bg-light');
                } else {
                    availabilityMessage.innerHTML = '<div class="text-success"><i class="fas fa-check-circle"></i> These dates appear to be available! Send an inquiry to confirm.</div>';
                    availabilityMessage.classList.add('bg-light');
                }
            }
        } else if (availabilityMessage) {
            availabilityMessage.innerHTML = '<div class="text-center"><i class="fas fa-info-circle"></i> Select dates to check availability</div>';
            availabilityMessage.classList.remove('bg-light');
        }
    }

    // Handle form submission
// Ažurirajte ovaj dio skripte koji se bavi slanjem forme
// Zamijenite postojeći kod za form.addEventListener u script.js

// Handle form submission
    const form = document.getElementById('inquiry-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            // Prevent the default form submission
            e.preventDefault();

            // Make sure dates are populated
            const checkIn = document.getElementById('check-in')?.value;
            const checkOut = document.getElementById('check-out')?.value;

            if (!checkIn || !checkOut) {
                alert('Please select both check-in and check-out dates before submitting.');
                return false;
            }

            // Update hidden date fields
            const startDateField = document.getElementById('startDate');
            const endDateField = document.getElementById('endDate');
            if (startDateField && endDateField) {
                startDateField.value = checkIn;
                endDateField.value = checkOut;
            }

            // Show loading state on button
            const submitButton = document.getElementById('submit-button');
            const originalButtonText = submitButton ? submitButton.innerHTML : 'Send Inquiry';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            }

            // Get form data - ovo je ključna promjena
            const formData = new FormData(form);
            const formDataObject = {};

            // Pretvori FormData u objekt za slanje
            formData.forEach((value, key) => {
                formDataObject[key] = value;
            });

            // Dodaj FormSubmit konfiguraciju
            formDataObject['_subject'] = 'New Booking Inquiry - Stone House';
            formDataObject['_captcha'] = 'false';
            formDataObject['_template'] = 'table';

            // Šalji podatke putem XMLHttpRequest
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://formsubmit.co/ajax/andrijasevic.ante53@gmail.com', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.setRequestHeader('Accept', 'application/json');

            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 400) {
                    // Success - hide error message first
                    const errorMessage = document.getElementById('error-message');
                    if (errorMessage) {
                        errorMessage.style.display = 'none';
                    }

                    // Show success message
                    const successMessage = document.getElementById('success-message');
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }

                    // Reset form
                    form.reset();

                    // Reset date pickers
                    const checkInElement = document.getElementById('check-in');
                    const checkOutElement = document.getElementById('check-out');
                    if (checkInElement && checkInElement._flatpickr) {
                        checkInElement._flatpickr.clear();
                    }
                    if (checkOutElement && checkOutElement._flatpickr) {
                        checkOutElement._flatpickr.clear();
                    }

                    // Reset availability message
                    const availabilityMessage = document.getElementById('availability-message');
                    if (availabilityMessage) {
                        availabilityMessage.innerHTML = '<div class="text-center"><i class="fas fa-info-circle"></i> Select dates to check availability</div>';
                        availabilityMessage.classList.remove('bg-light');
                    }
                } else {
                    // Error
                    const successMessage = document.getElementById('success-message');
                    if (successMessage) {
                        successMessage.style.display = 'none';
                    }

                    // Show error message
                    const errorMessage = document.getElementById('error-message');
                    if (errorMessage) {
                        errorMessage.style.display = 'block';
                        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    console.error('Form submission error:', xhr.responseText);
                }

                // Re-enable button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            };

            xhr.onerror = function() {
                // Network error
                const successMessage = document.getElementById('success-message');
                if (successMessage) {
                    successMessage.style.display = 'none';
                }

                const errorMessage = document.getElementById('error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                console.error('Network error occurred');

                // Re-enable button
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                }
            };

            // Ovo je kritično - pretvaramo objekt u JSON string i šaljemo
            xhr.send(JSON.stringify(formDataObject));
        });

    }
// Airbnb rating loader (if applicable)
document.addEventListener('DOMContentLoaded', function() {
    const ratingContainer = document.getElementById('airbnb-rating');
    if (ratingContainer) {
        // You can either fetch this from your backend or hardcode it
        // Example of hardcoded rating:
        ratingContainer.innerHTML = `
            <div class="rating-value">4.9 ★</div>
            <div class="rating-reviews">42 reviews on Airbnb</div>
        `;
    }
});

});


document.addEventListener('DOMContentLoaded', function() {
    let reservedDates = [];

    // Fetch reserved dates from backend with enhanced debugging
    fetch('/calendar/dates')
        .then(response => response.json())
        .then(dates => {
            console.log('Raw data received from /calendar/dates:', dates);

            // Log each reservation in detail
            dates.forEach((reservation, index) => {
                console.log(`Reservation ${index + 1}:`, {
                    from: reservation.from,
                    to: reservation.to,
                    fromDate: new Date(reservation.from),
                    toDate: new Date(reservation.to)
                });
            });

            reservedDates = dates;
            initializeDatePickers();
        })
        .catch(error => {
            console.error('Error fetching reservation dates:', error);
            reservedDates = [];
            initializeDatePickers();
        });

    function initializeDatePickers() {
        const disabledRanges = getDisabledRanges();
        console.log('Final disabled ranges for Flatpickr:', disabledRanges);

        const config = {
            minDate: "today",
            disable: disabledRanges,
            dateFormat: "Y-m-d",
            locale: {
                firstDayOfWeek: 1,
                weekdays: {
                    shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                },
                months: {
                    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    longhand: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                }
            },
            // Add this to see what Flatpickr is actually doing
            onReady: function(selectedDates, dateStr, instance) {
                console.log('Flatpickr initialized with disabled dates:', instance.config.disable);
            }
        };

        const checkInPicker = flatpickr("#check-in", {
            ...config,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    const startDateField = document.getElementById('startDate');
                    if (startDateField) {
                        startDateField.value = selectedDates[0].toISOString().split('T')[0];
                    }

                    const checkOutElement = document.getElementById('check-out');
                    if (checkOutElement && checkOutElement._flatpickr) {
                        checkOutElement._flatpickr.set('minDate', selectedDates[0]);
                    }
                    updateAvailability();
                }
            }
        });

        const checkOutPicker = flatpickr("#check-out", {
            ...config,
            onChange: function(selectedDates) {
                if (selectedDates[0]) {
                    const endDateField = document.getElementById('endDate');
                    if (endDateField) {
                        endDateField.value = selectedDates[0].toISOString().split('T')[0];
                    }

                    const checkInElement = document.getElementById('check-in');
                    if (checkInElement && checkInElement._flatpickr) {
                        checkInElement._flatpickr.set('maxDate', selectedDates[0]);
                    }
                    updateAvailability();
                }
            }
        });
    }

    function getDisabledRanges() {
        console.log('Building disabled ranges from:', reservedDates);

        const disabledRanges = reservedDates.map((r, index) => {
            console.log(`\nProcessing reservation ${index + 1}:`);
            console.log('Original from:', r.from, 'to:', r.to);

            const fromDate = new Date(r.from);
            const toDate = new Date(r.to);

            console.log('Parsed fromDate:', fromDate);
            console.log('Parsed toDate:', toDate);
            console.log('fromDate ISO:', fromDate.toISOString());
            console.log('toDate ISO:', toDate.toISOString());

            const range = {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0]
            };

            console.log('Final range for Flatpickr:', range);

            // Test if Sept 25, 2025 should be in this range
            const sept25 = new Date('2025-09-25');
            const isInRange = sept25 >= fromDate && sept25 <= toDate;
            console.log(`Sept 25, 2025 in this range? ${isInRange}`);

            return range;
        });

        console.log('All disabled ranges:', disabledRanges);
        return disabledRanges;
    }

    function updateAvailability() {
        const checkIn = document.getElementById('check-in')?.value;
        const checkOut = document.getElementById('check-out')?.value;
        const availabilityMessage = document.getElementById('availability-message');
        const startDateField = document.getElementById('startDate');
        const endDateField = document.getElementById('endDate');

        if (checkIn && checkOut && startDateField && endDateField) {
            startDateField.value = checkIn;
            endDateField.value = checkOut;

            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            const isConflict = reservedDates.some(r => {
                const reservedStart = new Date(r.from);
                const reservedEnd = new Date(r.to);
                return (checkInDate < reservedEnd && checkOutDate > reservedStart);
            });

            if (availabilityMessage) {
                if (isConflict) {
                    availabilityMessage.innerHTML = '<div class="text-danger"><i class="fas fa-times-circle"></i> These dates are not available. Please select different dates.</div>';
                    availabilityMessage.classList.add('bg-light');
                } else {
                    availabilityMessage.innerHTML = '<div class="text-success"><i class="fas fa-check-circle"></i> These dates appear to be available! Send an inquiry to confirm.</div>';
                    availabilityMessage.classList.add('bg-light');
                }
            }
        } else if (availabilityMessage) {
            availabilityMessage.innerHTML = '<div class="text-center"><i class="fas fa-info-circle"></i> Select dates to check availability</div>';
            availabilityMessage.classList.remove('bg-light');
        }
    }

    // Keep your existing form submission code here...
});