// script.js

document.addEventListener('DOMContentLoaded', function() {

    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            preloader.style.display = 'none';
          }
        })
      });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }


    // --- MODIFIED: Project Modal Functionality ---
    const projectCards = document.querySelectorAll('.project'); // Target the whole card
    const closeButtons = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');

    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the target modal ID from the data attribute
            const modalId = this.dataset.modalTarget; // Use dataset property
            // const modalId = this.getAttribute('data-modal-target'); // Alternative

            if (modalId) { // Check if the attribute exists
                const targetModal = document.querySelector(modalId);
                if (targetModal) {
                    targetModal.style.display = 'block';
                    // Optional: Add class to body to prevent scrolling while modal is open
                    document.body.classList.add('modal-open');
                } else {
                    console.error('Modal not found for target:', modalId);
                }
            } else {
                console.error('Data attribute "data-modal-target" not found on:', this);
            }
        });

        // Optional: Add keyboard accessibility
        card.setAttribute('tabindex', '0'); // Make it focusable
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent spacebar scrolling
                this.click(); // Trigger the click event handler
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
            // Optional: Remove class from body
            document.body.classList.remove('modal-open');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        modals.forEach( modal => {
          if (event.target == modal) {
              modal.style.display = 'none';
               // Optional: Remove class from body
              document.body.classList.remove('modal-open');
          }
        });
    });


    // --- START: Custom Cursor Logic ---
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) { // Check if the element exists
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const speed = 0.1; // Adjust for smoother following (0.1 is slower, 1 is instant)

        function animateCursor() {
            cursorX += (mouseX - cursorX) * speed;
            cursorY += (mouseY - cursorY) * speed;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor(); // Start the animation loop

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add('visible'); // Make visible on move

            const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
            if (hoveredElement && hoveredElement.closest('span, a, button, .project, input, textarea, select, label, .menu-toggle, [role="button"], [onclick]')) { // Added select, label, [role], [onclick]
                cursor.classList.add('cursor-hover-link');
            } else {
                cursor.classList.remove('cursor-hover-link');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible'); // Hide on leave
        });

        document.addEventListener('mouseenter', () => {
             cursor.classList.add('visible'); // Show on enter
         });
    }
    // --- END: Custom Cursor Logic ---



    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

     // Update Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- GSAP Animations ---
    // Simple Fade-In for Sections
    gsap.utils.toArray(".section").forEach(section => {
      gsap.from(section, {
          opacity: 0,
          y: 50,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%", // Trigger when 80% of the section is visible
            // markers: true,  // Uncomment for debugging
            toggleActions: "play none none none"
          }
      });
    });

    // Parallax effect on Hero Image (subtle) - only if hero image exists
    const heroImage = document.querySelector('.hero-image');
    if (heroImage){
      gsap.to(heroImage, {
        yPercent: -10, // subtle upward movement
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top bottom", // start when top of hero hits bottom of viewport
          end: "bottom top",    // end when bottom of hero hits top of viewport
          scrub: true,     // smooth scrubbing effect
          // markers: true
        }
      });
    }


    // Form Submission (Placeholder - Needs Backend)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // 1. Basic Form Validation (Client-Side)
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                alert('Please fill in all fields.'); // Basic validation
                return;
            }

            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // 2.  Data Preparation (for sending to the server)
            const formData = {
                name: name,
                email: email,
                message: message
            };

            // 3.  Simulate Sending (Replace with actual sending)
            console.log('Form Data:', formData); // Log the data (for demonstration)
            alert('Thank you! Your message has been sent (simulated).'); // Success message
            contactForm.reset(); // Clear the form


           // ---  ACTUAL SENDING (Requires a backend or serverless function) ---
            /*  Example using fetch (to a serverless function)
            fetch('/api/send-email', {  // Replace with your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) {
                  throw new Error(`Network response was not ok: ${response.status}`);
                }
                return response.json(); // Or response.text() if not JSON
            })
            .then(data => {
                console.log('Success:', data);
                alert('Thank you! Your message has been sent.');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again later.');
            });

            */

        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

});