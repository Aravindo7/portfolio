const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });
}

const revealElements = document.querySelectorAll(
    ".work-card, .expertise-card, .technology-group, .experience-card"
);

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");
                observerInstance.unobserve(entry.target);
            });
        },
        { threshold: 0.08 }
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

const footerYear = document.querySelector(".footer-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}
