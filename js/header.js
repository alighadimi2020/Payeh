document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".payeh-menu-toggle");
    const menu = document.querySelector(".payeh-mobile-menu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            const open = menu.classList.toggle("open");
            toggle.classList.toggle("open", open);
            toggle.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", event => {
            if (!event.target.closest(".payeh-header")) {
                menu.classList.remove("open");
                toggle.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }
});
