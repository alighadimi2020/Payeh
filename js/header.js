document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const navigation = document.querySelector(".main-navigation");

    if (!toggle || !navigation) {
        return;
    }

    const closeMenu = () => {
        toggle.classList.remove("is-active");
        navigation.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        toggle.classList.toggle("is-active", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            navigation.classList.contains("is-open") &&
            !navigation.contains(event.target) &&
            !toggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
});
