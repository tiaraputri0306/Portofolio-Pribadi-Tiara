document.addEventListener("DOMContentLoaded", function () {
  // === Scroll Reveal Animation ===
  const sections = document.querySelectorAll(".content-section");

  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.1, // 10% of the section must be visible to trigger
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
      } else {
        entry.target.classList.remove("appear"); // Optional: Remove when not intersecting
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });

  // === Dark Mode Toggle ===
  const darkModeToggle = document.getElementById("darkModeToggle");
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = localStorage.getItem("theme");

  // Set initial theme based on localStorage or system preference
  if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else if (currentTheme === "light") {
    document.body.classList.remove("dark-mode");
  } else if (prefersDarkMode) {
    document.body.classList.add("dark-mode");
  }

  // Update button icon on load
  updateDarkModeToggleIcon();

  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
    updateDarkModeToggleIcon();
  });

  function updateDarkModeToggleIcon() {
    if (document.body.classList.contains("dark-mode")) {
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  // === Smooth Scroll & Active Navigation Link ===
  const navLinks = document.querySelectorAll(".main-nav a");
  const mainContent = document.querySelector(".main-content");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Mencegah perilaku default anchor link

      const targetId = this.getAttribute("href"); // Dapatkan ID target (misal: #about)
      const targetSection = document.querySelector(targetId); // Dapatkan elemen section

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth", // Gulir dengan animasi halus
        });
      }
    });
  });

  // Intersection Observer for active navigation links
  const mainSections = document.querySelectorAll(".main-content section");

  const sectionObserverOptions = {
    root: null, // Mengamati elemen di dalam viewport
    rootMargin: "-50% 0px -49% 0px", // Ketika bagian tengah dari section masuk view
    threshold: 0, // Ambang batas 0 berarti seketika terlihat langsung trigger
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      const correspondingNavLink = document.querySelector(
        `.main-nav a[href="#${id}"]`
      );

      if (correspondingNavLink) {
        if (entry.isIntersecting) {
          // Hapus kelas 'active' dari semua link
          navLinks.forEach((link) => link.classList.remove("active"));
          // Tambahkan kelas 'active' ke link yang sesuai
          correspondingNavLink.classList.add("active");
        }
        // Jika tidak intersecting, biarkan kelas 'active' tetap ada pada link sebelumnya
        // Ini mencegah flickering saat scroll cepat antar section
      }
    });
  }, sectionObserverOptions);

  // Amati setiap section
  mainSections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // Set active link on initial load (for when page loads not at top)
  window.addEventListener("load", () => {
    // Find the first section that is significantly visible
    const firstVisibleSection = Array.from(mainSections).find((section) => {
      const rect = section.getBoundingClientRect();
      // Check if at least 50% of the section is visible
      return (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
      );
    });
    if (firstVisibleSection) {
      const id = firstVisibleSection.getAttribute("id");
      const correspondingNavLink = document.querySelector(
        `.main-nav a[href="#${id}"]`
      );
      if (correspondingNavLink) {
        navLinks.forEach((link) => link.classList.remove("active")); // Clear all
        correspondingNavLink.classList.add("active"); // Set active
      }
    } else {
      // Default to 'About Me' if no section is clearly in view (e.g., at very top)
      document
        .querySelector('.main-nav a[href="#about"]')
        .classList.add("active");
    }
  });
});
