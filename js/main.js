(() => {
    "use strict";

    const components = [
        ["header", "components/header.html"],
        ["hero", "components/hero.html"],
        ["bar", "components/bar.html"],
        ["service", "components/service.html"],
        ["why", "components/why.html"],
        ["servic_bar", "components/servic_bar.html"],
        ["consol", "components/consol.html"],
        ["mag", "components/mag.html"],
        ["baner", "components/baner.html"],
        ["footer", "components/footer.html"]
    ];

    const loadedComponents = new Set();

    function getSlot(name) {
        return document.querySelector(`[data-component="${name}"]`);
    }

    function copyComponentStyles(doc) {
        doc.querySelectorAll("style").forEach(style => {
            const css = style.textContent.trim();

            if (!css) {
                style.remove();
                return;
            }

            const exists = Array.from(
                document.head.querySelectorAll("style[data-payeh-component]")
            ).some(item => item.textContent.trim() === css);

            if (!exists) {
                const newStyle = document.createElement("style");

                newStyle.setAttribute(
                    "data-payeh-component",
                    ""
                );

                newStyle.textContent = css;

                document.head.appendChild(newStyle);
            }

            style.remove();
        });
    }

    function removeComponentScripts(doc) {
        doc.querySelectorAll("script").forEach(script => {
            script.remove();
        });
    }

    function fixComponentPaths(container) {
        container.querySelectorAll("[src]").forEach(element => {
            const src = element.getAttribute("src");

            if (!src) {
                return;
            }

            if (
                src.startsWith(
                    "/home/ali/Desktop/Payeh/modular/"
                )
            ) {
                element.setAttribute(
                    "src",
                    src.replace(
                        "/home/ali/Desktop/Payeh/modular/",
                        ""
                    )
                );
            }
        });

        container.querySelectorAll("[href]").forEach(element => {
            const href = element.getAttribute("href");

            if (!href) {
                return;
            }

            if (href === "../login.html") {
                element.setAttribute(
                    "href",
                    "login.html"
                );
            }
        });
    }

    function getComponentBody(doc) {
        if (
            doc.body &&
            doc.body.children.length
        ) {
            return Array.from(
                doc.body.children
            );
        }

        return Array.from(
            doc.children
        );
    }

    function addRevealClass(container, name) {
        if (
            name === "header" ||
            name === "footer"
        ) {
            return;
        }

        container
            .querySelectorAll(":scope > section")
            .forEach(section => {
                section.classList.add(
                    "payeh-reveal"
                );
            });
    }

    function initMobileMenu() {
        const toggle =
            document.querySelector(
                ".payeh-menu-toggle"
            );

        const menu =
            document.querySelector(
                ".payeh-mobile-menu"
            );

        if (!toggle || !menu) {
            return;
        }

        if (
            toggle.dataset.payehInitialized ===
            "true"
        ) {
            return;
        }

        toggle.dataset.payehInitialized =
            "true";

        toggle.addEventListener(
            "click",
            event => {
                event.stopPropagation();

                const isOpen =
                    menu.classList.toggle(
                        "open"
                    );

                toggle.classList.toggle(
                    "open",
                    isOpen
                );

                toggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );

        menu.querySelectorAll("a").forEach(
            link => {
                link.addEventListener(
                    "click",
                    () => {
                        menu.classList.remove(
                            "open"
                        );

                        toggle.classList.remove(
                            "open"
                        );

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                );
            }
        );

        document.addEventListener(
            "click",
            event => {
                if (
                    !event.target.closest(
                        ".payeh-header"
                    )
                ) {
                    menu.classList.remove(
                        "open"
                    );

                    toggle.classList.remove(
                        "open"
                    );

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            }
        );
    }

    function initServiceBarMarquee() {
        const marquee = document.querySelector(".service-bar-marquee");
        const track = marquee?.querySelector(".service-bar-track:not(.service-bar-track--clone)");
        const clone = marquee?.querySelector(".service-bar-track--clone");

        if (!marquee || !track || !clone) {
            return;
        }

        if (clone.dataset.payehSynced === "true") {
            return;
        }

        clone.innerHTML = track.innerHTML;
        clone.setAttribute("aria-hidden", "true");
        clone.dataset.payehSynced = "true";

        clone.querySelectorAll("a").forEach(link => {
            link.setAttribute("tabindex", "-1");
            link.setAttribute("aria-hidden", "true");
        });
    }

    function initScrollAnimation() {
        const elements =
            document.querySelectorAll(
                ".payeh-reveal:not([data-payeh-animation])"
            );

        if (!elements.length) {
            return;
        }

        const reduceMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        if (
            reduceMotion ||
            !("IntersectionObserver" in window)
        ) {
            elements.forEach(element => {
                element.classList.add(
                    "is-visible"
                );

                element.setAttribute(
                    "data-payeh-animation",
                    "done"
                );
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        entry.target.setAttribute(
                            "data-payeh-animation",
                            "done"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -7% 0px"
                }
            );

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    async function loadComponent(
        name,
        path
    ) {
        const slot = getSlot(name);

        if (
            !slot ||
            loadedComponents.has(name)
        ) {
            return;
        }

        try {
            const response =
                await fetch(path, {
                    method: "GET",
                    cache: "no-cache"
                });

            if (!response.ok) {
                throw new Error(
                    `Payeh component "${name}" could not be loaded.`
                );
            }

            const html =
                await response.text();

            const doc =
                new DOMParser()
                    .parseFromString(
                        html,
                        "text/html"
                    );

            copyComponentStyles(doc);

            removeComponentScripts(doc);

            const nodes =
                getComponentBody(doc);

            const fragment =
                document.createDocumentFragment();

            nodes.forEach(node => {
                fragment.appendChild(
                    document.importNode(
                        node,
                        true
                    )
                );
            });

            slot.replaceChildren(
                fragment
            );

            fixComponentPaths(slot);

            addRevealClass(
                slot,
                name
            );

            loadedComponents.add(
                name
            );

            if (
                name === "header"
            ) {
                initMobileMenu();
            }

            if (name === "servic_bar") {
                initServiceBarMarquee();
            }

            initScrollAnimation();

        } catch (error) {
            console.error(error);

            slot.setAttribute(
                "data-payeh-component-error",
                name
            );
        }
    }

    async function loadPage() {
        for (
            const [
                name,
                path
            ] of components
        ) {
            await loadComponent(
                name,
                path
            );
        }

        initMobileMenu();

        initScrollAnimation();
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            loadPage,
            {
                once: true
            }
        );
    } else {
        loadPage();
    }
})();