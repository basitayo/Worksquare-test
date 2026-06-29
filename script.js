/* ==========================================================================
   WORKSQUARE SOLUTIONS - ENGINE MATRIX CONTROLLER
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // 1. MODULE: CORE INTERACTION SCROLL REVEALS
    // ----------------------------------------------------------------------
    const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Kill tracking on element to save processing
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-element').forEach(element => {
        scrollRevealObserver.observe(element);
    });

    // ----------------------------------------------------------------------
    // 2. MODULE: NUMERIC TELEMETRY COUNT-UP ENGINES
    // ----------------------------------------------------------------------
    const runCounterAnimation = (element) => {
        const target = +element.getAttribute("data-target");
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easeProgress = progress * (2 - progress); // Fluid deceleration curve
            
            element.innerText = Math.floor(easeProgress * target);

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.innerText = target;
            }
        };
        requestAnimationFrame(updateNumber);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    runCounterAnimation(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

    // ----------------------------------------------------------------------
    // 3. MODULE: MODAL OVERLAY TRIGGER HANDLERS
    // ----------------------------------------------------------------------
    const modal = document.getElementById("appointmentModal");
    const openBtns = document.querySelectorAll(".openModalBtn");
    const closeBtn = document.querySelector(".close-modal");

    if (modal && openBtns.length > 0 && closeBtn) {
        openBtns.forEach(btn => btn.onclick = () => modal.classList.add("active"));
        closeBtn.onclick = () => modal.classList.remove("active");
        window.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); }
    }

    // ----------------------------------------------------------------------
    // 4. MODULE: ASYNCHRONOUS FORM SUBMISSIONS (FORMSPREE BACKEND)
    // ----------------------------------------------------------------------
    const appForm = document.getElementById("appointmentForm");
    const appSuccess = document.getElementById("successMessage");

    if (appForm && appSuccess) {
        appForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = appForm.querySelector(".submit-booking");
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Transmitting Telemetry Window...";

            try {
                const response = await fetch(appForm.action, {
                    method: 'POST',
                    body: new FormData(appForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    appForm.style.display = "none";
                    appSuccess.style.display = "block";
                    setTimeout(() => {
                        modal.classList.remove("active");
                        setTimeout(() => {
                            appForm.style.display = "block";
                            appSuccess.style.display = "none";
                            submitBtn.innerText = originalText;
                            appForm.reset();
                        }, 400);
                    }, 2500);
                } else {
                    alert("Allocation error. Please verify fields.");
                    submitBtn.innerText = originalText;
                }
            } catch (error) {
                alert("Network connection routing dropped.");
                submitBtn.innerText = originalText;
            }
        };
    }

    // Testimonials Specific Form
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackSuccess = document.getElementById("feedbackSuccess");

    if (feedbackForm && feedbackSuccess) {
        feedbackForm.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = feedbackForm.querySelector("button[type='submit']");
            submitBtn.innerText = "Indexing Log Data to Email...";

            try {
                const response = await fetch(feedbackForm.action, {
                    method: 'POST',
                    body: new FormData(feedbackForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    feedbackForm.style.display = "none";
                    feedbackSuccess.style.display = "block";
                } else {
                    alert("Could not process review log trace.");
                    submitBtn.innerText = "Transmit Feedback Log";
                }
            } catch (error) {
                alert("Data routing system error.");
                submitBtn.innerText = "Transmit Feedback Log";
            }
        };
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const accordionTriggers = document.querySelectorAll(".accordion-trigger");

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener("click", function() {
            const currentItem = this.parentElement;
            const currentPanel = this.nextElementSibling;
            
            // Check if item is already active
            const isActive = currentItem.classList.contains("active");
            
            // Close all other open panel cards smoothly
            document.querySelectorAll(".accordion-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".accordion-panel").style.maxHeight = null;
            });
            
            // If clicked card wasn't active, expand it by calculating scrollHeight
            if (!isActive) {
                currentItem.classList.add("active");
                currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
            }
        });
    });
});