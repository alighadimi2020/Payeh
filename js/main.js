document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const revealElements = document.querySelectorAll(
        ".feature-card, .service-card, .article-card, .guarantee-item, .consultation-content, .final-cta-content"
    );

    const smoothLinks = document.querySelectorAll('a[href^="#"]');

    if (header) {
        const updateHeader = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 20);
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    if (revealElements.length) {
        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observerInstance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element, index) => {
            element.style.setProperty(
                "--reveal-delay",
                `${Math.min(index * 45, 220)}ms`
            );

            observer.observe(element);
        });
    }

    smoothLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header
                ? header.getBoundingClientRect().height
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });

    const horizontalTracks = document.querySelectorAll(
        ".magazine-track, .quick-services-track, .guarantee-track"
    );

    horizontalTracks.forEach((track) => {
        let isDragging = false;
        let startX = 0;
        let startScroll = 0;

        track.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "touch") {
                return;
            }

            isDragging = true;
            startX = event.clientX;
            startScroll = track.scrollLeft;

            track.classList.add("is-dragging");
            track.setPointerCapture(event.pointerId);
        });

        track.addEventListener("pointermove", (event) => {
            if (!isDragging) {
                return;
            }

            const distance = event.clientX - startX;
            track.scrollLeft = startScroll - distance;
        });

        const stopDragging = (event) => {
            if (!isDragging) {
                return;
            }

            isDragging = false;
            track.classList.remove("is-dragging");

            if (
                event.pointerId !== undefined &&
                track.hasPointerCapture(event.pointerId)
            ) {
                track.releasePointerCapture(event.pointerId);
            }
        };

        track.addEventListener("pointerup", stopDragging);
        track.addEventListener("pointercancel", stopDragging);
        track.addEventListener("lostpointercapture", () => {
            isDragging = false;
            track.classList.remove("is-dragging");
        });
    });

    const newsletterForms = document.querySelectorAll(".newsletter-form");

    newsletterForms.forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const input = form.querySelector("input");

            if (!input || !input.value.trim()) {
                return;
            }

            input.value = "";
            input.blur();
        });
    });
});
