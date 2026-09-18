/* =========================================================
   PORTFOLIO INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SHARED STATE
    ===================================================== */

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        const closeMenu = () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        };

        menuToggle.addEventListener("click", () => {
            const isOpen = !navLinks.classList.contains("active");

            if (isOpen) {
                navLinks.classList.add("active");
                menuToggle.classList.add("active");
                menuToggle.setAttribute("aria-expanded", "true");
                document.body.classList.add("menu-open");
            } else {
                closeMenu();
            }
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) closeMenu();
        });
    }


    /* =====================================================
       PROJECT FILTERS
    ===================================================== */

    const projectFilters = document.querySelectorAll(".project-filter");
    const projectItems = document.querySelectorAll(".project-showcase, .work-card");

    if (projectFilters.length && projectItems.length) {

        const showProject = (project) => {

            /* Clear any inline tilt transform first */
            project.style.transform = "";

            project.removeAttribute("data-collapsed");
            project.classList.remove("filter-hidden");
        };

        const hideProject = (project) => {

            /* Clear tilt so CSS class takes over cleanly */
            project.style.transform = "";

            project.classList.add("filter-hidden");

            /* Collapse after the fade completes so grid reflows */
            window.setTimeout(() => {
                if (project.classList.contains("filter-hidden")) {
                    project.setAttribute("data-collapsed", "true");
                }
            }, 260);
        };

        projectFilters.forEach((filterButton) => {

            filterButton.addEventListener("click", (event) => {

                /* Ripple */
                if (!prefersReducedMotion) {
                    const rect = filterButton.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const ripple = document.createElement("span");
                    ripple.className = "ripple";
                    ripple.style.width = `${size}px`;
                    ripple.style.height = `${size}px`;
                    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
                    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
                    filterButton.appendChild(ripple);
                    window.setTimeout(() => ripple.remove(), 620);
                }

                const selectedFilter = filterButton.dataset.filter || "all";

                projectFilters.forEach((button) => {
                    const isActive = button === filterButton;
                    button.classList.toggle("active", isActive);
                    button.setAttribute("aria-selected", String(isActive));
                });

                projectItems.forEach((project) => {
                    const categories = project.dataset.category || "";
                    const categoryList = categories.trim().split(/\s+/).filter(Boolean);
                    const shouldShow =
                        selectedFilter === "all" ||
                        categoryList.includes(selectedFilter);

                    if (shouldShow) {
                        showProject(project);
                    } else {
                        hideProject(project);
                    }
                });
            });
        });

        projectFilters.forEach((button) => {
            button.setAttribute(
                "aria-selected",
                button.classList.contains("active") ? "true" : "false"
            );
        });
    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements = document.querySelectorAll(
        [
            ".project-showcase",
            ".work-card",
            ".case-study-card",
            ".process-step",
            ".architecture-node",
            ".note-card",
            ".expertise-card",
            ".technology-group",
            ".experience-card",
            ".currently-building"
        ].join(", ")
    );

    if ("IntersectionObserver" in window && !prefersReducedMotion) {

        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -35px 0px" }
        );

        revealElements.forEach((element) => {
            element.classList.add("reveal");
            observer.observe(element);
        });

    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    /* =====================================================
       STAGGERED CARD REVEAL
    ===================================================== */

    const revealGroups = document.querySelectorAll(
        [
            ".work-grid",
            ".case-study-grid",
            ".engineering-process",
            ".expertise-grid",
            ".notes-grid"
        ].join(", ")
    );

    revealGroups.forEach((group) => {
        const children = group.querySelectorAll(
            [
                ".work-card",
                ".case-study-card",
                ".process-step",
                ".expertise-card",
                ".note-card"
            ].join(", ")
        );

        children.forEach((child, index) => {
            const delay = Math.min(index * 60, 300);
            child.style.setProperty("--reveal-delay", `${delay}ms`);
        });
    });


    /* =====================================================
       TERMINAL TYPE-IN
    ===================================================== */

    const terminal = document.querySelector(".terminal");
    const terminalLines = document.querySelectorAll(".terminal-body [data-type-line]");

    if (terminal && terminalLines.length) {

        if (prefersReducedMotion) {
            terminal.classList.add("type-in");
        } else {

            const terminalObserver = new IntersectionObserver(
                (entries, obs) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        terminalLines.forEach((line, index) => {
                            line.style.transitionDelay = `${index * 55}ms`;
                        });

                        terminal.classList.add("type-in");
                        obs.unobserve(entry.target);
                    });
                },
                { threshold: 0.35 }
            );

            terminalObserver.observe(terminal);
        }
    }


    /* =====================================================
       BACK TO TOP + SCROLL PROGRESS
    ===================================================== */

    const progressBar = document.querySelector(".scroll-progress");
    const toTop = document.getElementById("toTop");

    let progressTicking = false;

    const updateProgress = () => {

        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const scrollHeight =
            (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;

        const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (progressBar) {
            progressBar.style.setProperty("--scroll-progress", `${pct}%`);
        }

        if (toTop) {
            toTop.classList.toggle("visible", scrollTop > 600);
        }

        progressTicking = false;
    };

    const onScroll = () => {
        if (!progressTicking) {
            progressTicking = true;
            window.requestAnimationFrame(updateProgress);
        }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    if (toTop) {
        toTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }


    /* =====================================================
       SCROLL SPY
    ===================================================== */

    const navAnchors = document.querySelectorAll(".nav-links a");

    if (navAnchors.length && "IntersectionObserver" in window) {

        const idToLink = new Map();

        navAnchors.forEach((link) => {
            const href = link.getAttribute("href") || "";
            if (href.startsWith("#")) {
                idToLink.set(href.slice(1), link);
            }
        });

        const spySections = Array.from(
            document.querySelectorAll("section[id]")
        ).filter((sec) => idToLink.has(sec.id));

        if (spySections.length) {

            const setActive = (id) => {
                navAnchors.forEach((link) => link.classList.remove("active"));
                const active = idToLink.get(id);
                if (active) active.classList.add("active");
            };

            const visibleIds = new Map();

            const spyObserver = new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            visibleIds.set(entry.target.id, entry.intersectionRatio);
                        } else {
                            visibleIds.delete(entry.target.id);
                        }
                    });

                    let bestId = null;
                    let bestRatio = -1;

                    spySections.forEach((sec) => {
                        const ratio = visibleIds.get(sec.id);
                        if (ratio !== undefined && ratio > bestRatio) {
                            bestRatio = ratio;
                            bestId = sec.id;
                        }
                    });

                    if (bestId) setActive(bestId);
                },
                {
                    threshold: [0.15, 0.35, 0.55, 0.75],
                    rootMargin: "-70px 0px -55% 0px"
                }
            );

            spySections.forEach((sec) => spyObserver.observe(sec));
        }
    }


    /* =====================================================
       CARD POINTER TILT
    ===================================================== */

    const tiltCards = document.querySelectorAll(
        ".work-card, .case-study-card, .project-showcase"
    );

    const canHover = window.matchMedia("(hover: hover)").matches;

    if (canHover && !prefersReducedMotion) {

        tiltCards.forEach((card) => {

            const MAX_TILT = 3;

            const onMove = (event) => {

                /* Skip if filtered out */
                if (card.classList.contains("filter-hidden")) return;

                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotY = (x - 0.5) * (MAX_TILT * 2);
                const rotX = (y - 0.5) * -(MAX_TILT * 2);

                const lift = card.classList.contains("work-card")
                    ? "translateY(-5px)"
                    : "translateY(-3px)";

                card.style.transform =
                    `${lift} rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            };

            const reset = () => {
                card.style.transform = "";
            };

            card.addEventListener("pointermove", onMove);
            card.addEventListener("pointerleave", reset);
            card.addEventListener("pointercancel", reset);
        });
    }


    /* =====================================================
       COPY TO CLIPBOARD
    ===================================================== */

    const copyTargets = document.querySelectorAll("[data-copy]");

    copyTargets.forEach((el) => {

        el.addEventListener("click", async (event) => {

            if (event.metaKey || event.ctrlKey || event.shiftKey) return;

            const value = el.dataset.copy || "";
            if (!value) return;

            event.preventDefault();

            let copied = false;

            try {
                if (navigator.clipboard) {
                    await navigator.clipboard.writeText(value);
                    copied = true;
                }
            } catch (err) {
                copied = false;
            }

            if (!copied) {
                const ta = document.createElement("textarea");
                ta.value = value;
                ta.style.position = "fixed";
                ta.style.opacity = "0";
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand("copy");
                    copied = true;
                } catch (err) {
                    copied = false;
                }
                ta.remove();
            }

            if (!copied) return;

            const originalHTML = el.innerHTML;
            el.classList.add("copied");

            if (el.classList.contains("button")) {
                el.innerHTML = `Copied <span>✓</span>`;
            } else {
                el.textContent = "Copied ✓";
            }

            window.setTimeout(() => {
                el.classList.remove("copied");
                el.innerHTML = originalHTML;
            }, 1400);
        });
    });


    /* =====================================================
       FOOTER YEAR
    ===================================================== */

    const footerYear = document.querySelector(".footer-year");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });


    /* =====================================================
       FILTER KEYBOARD NAVIGATION
    ===================================================== */

    projectFilters.forEach((button) => {

        button.addEventListener("keydown", (event) => {

            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

            event.preventDefault();

            const buttons = Array.from(projectFilters);
            const currentIndex = buttons.indexOf(button);
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex =
                (currentIndex + direction + buttons.length) % buttons.length;

            buttons[nextIndex].focus();
        });
    });

});