// Common shared JavaScript for reusable site interactions.

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const header = document.querySelector(".site-header");
  const revealItems = document.querySelectorAll(".reveal");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isExpanded));
      siteNav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open");
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  if (header) {
    const handleHeaderState = () => {
      if (window.scrollY > 12) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    handleHeaderState();
    window.addEventListener("scroll", handleHeaderState, { passive: true });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const searchInput = document.querySelector("#book-search");
  const searchResults = document.querySelector("#search-results");
  const actionButtons = document.querySelectorAll("[data-action]");

  const books = [
    {
      title: "Data Structures",
      author: "M. Singh",
      category: "Computer Science",
      availability: "Available",
      coverClass: "cover-blue",
      label: "DS",
    },
    {
      title: "Database Management System",
      author: "R. Patel",
      category: "Software Engineering",
      availability: "Issued",
      coverClass: "cover-purple",
      label: "DB",
    },
    {
      title: "Computer Networks",
      author: "S. Desai",
      category: "Networking",
      availability: "Available",
      coverClass: "cover-cyan",
      label: "CN",
    },
    {
      title: "Operating Systems",
      author: "P. Kumar",
      category: "Computer Science",
      availability: "Available",
      coverClass: "cover-indigo",
      label: "OS",
    },
    {
      title: "Engineering Mathematics",
      author: "A. Joshi",
      category: "Mathematics",
      availability: "Available",
      coverClass: "cover-blue",
      label: "EM",
    },
    {
      title: "Digital Electronics",
      author: "K. Shah",
      category: "Electronics",
      availability: "Issued",
      coverClass: "cover-purple",
      label: "DE",
    },
  ];

  const renderBooks = (items) => {
    if (!searchResults) return;

    if (items.length === 0) {
      searchResults.innerHTML = '<div class="card"><p>No books matched your search. Please try a different title, author, or ISBN.</p></div>';
      return;
    }

    searchResults.innerHTML = items
      .map(
        (book) => `
        <article class="book-card">
          <div class="book-cover ${book.coverClass}">${book.label}</div>
          <div class="book-details">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Category: ${book.category}</p>
          </div>
          <span class="status-badge ${book.availability === "Available" ? "status-available" : "status-issued"}">${book.availability}</span>
        </article>
      `
      )
      .join("");
  };

  const normalize = (value) => value.toLowerCase();

  const updateSearchResults = (query) => {
    const normalizedQuery = normalize(query.trim());

    if (!normalizedQuery) {
      renderBooks(books);
      return;
    }

    const filtered = books.filter((book) => {
      return (
        normalize(book.title).includes(normalizedQuery) ||
        normalize(book.author).includes(normalizedQuery) ||
        normalize(book.category).includes(normalizedQuery)
      );
    });

    renderBooks(filtered);
  };

  if (searchInput && searchResults) {
    renderBooks(books);

    searchInput.addEventListener("input", (event) => {
      updateSearchResults(event.target.value);
    });
  }

  const scrollToSection = (selector) => {
    const section = document.querySelector(selector);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "search-books") {
        scrollToSection("#search-books");
        searchInput?.focus();
      }
      if (action === "view-timing") {
        scrollToSection("#library-timing");
      }
      if (action === "browse-collection") {
        scrollToSection("#recent-books");
      }
    });
  });
});
