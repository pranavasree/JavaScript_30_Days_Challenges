// Check if DOM is fully loaded before executing any code
document.addEventListener("DOMContentLoaded", function () {
  // API key for TMDb API
  const API_KEY = "184942cfa661d4cd2cac2ddce02d7454";

  // DOM elements
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const resultsContainer = document.getElementById("results-container");
  const yearFilter = document.getElementById("year-filter");
  const languageFilter = document.getElementById("language-filter");
  const filterButton = document.getElementById("filter-button");
  const prevPageButton = document.getElementById("prev-page");
  const nextPageButton = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");
  const modal = document.getElementById("movie-modal");
  const modalContent = document.getElementById("modal-content");
  const closeModalButton = document.querySelector(".close-modal");
  const toastContainer = document.getElementById("toast-container");
  const navLinks = document.querySelectorAll("nav a");
  const contentSections = document.querySelectorAll(".content-section");
  const watchlistContainer = document.getElementById("watchlist-container");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  // Global variables
  let currentPage = 1;
  let totalPages = 0;
  let currentSearchTerm = "";
  let currentResults = [];
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // Basic event listeners
  if (searchButton) {
    searchButton.addEventListener("click", searchMovies);
  }

  if (searchInput) {
    searchInput.addEventListener("keyup", (e) => {
      if (e.key === "Enter") searchMovies();
    });
  }

  if (filterButton) {
    filterButton.addEventListener("click", applyFilters);
  }

  if (prevPageButton) {
    prevPageButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchPage(currentPage);
      }
    });
  }

  if (nextPageButton) {
    nextPageButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchPage(currentPage);
      }
    });
  }

  // Close modal
  if (closeModalButton && modal) {
    closeModalButton.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Dark mode toggle
  if (darkModeToggle) {
    // Check saved preference
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", () => {
      if (darkModeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }

  // Navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Update active link
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Show selected section
      const sectionId = link.getAttribute("data-section") + "-section";
      contentSections.forEach((section) => {
        section.classList.remove("active");
      });

      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add("active");

        // Load content based on section
        if (sectionId === "home-section") {
          showPopularMovies();
        } else if (sectionId === "watchlist-section") {
          displayWatchlist();
        }
      }
    });
  });

  // Search movies function
  async function searchMovies() {
    if (!searchInput || !resultsContainer) return;

    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
      showPopularMovies();
      return;
    }

    currentSearchTerm = searchTerm;
    currentPage = 1;

    // Show loading
    resultsContainer.innerHTML = '<div class="loading"></div>';

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          searchTerm
        )}&page=${currentPage}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      currentResults = data.results || [];
      totalPages = data.total_pages || 1;

      displayResults();
      updatePagination();
    } catch (error) {
      console.error("Search error:", error);
      resultsContainer.innerHTML = `<p>Error searching for movies: ${error.message}</p>`;
    }
  }

  // Show popular movies
  async function showPopularMovies() {
    if (!resultsContainer) return;

    currentSearchTerm = "";
    currentPage = 1;

    // Show loading
    resultsContainer.innerHTML = '<div class="loading"></div>';

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${currentPage}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      currentResults = data.results || [];
      totalPages = data.total_pages || 1;

      displayResults();
      updatePagination();
    } catch (error) {
      console.error("Popular movies error:", error);
      resultsContainer.innerHTML = `<p>Error loading popular movies: ${error.message}</p>`;
    }
  }

  // Display results
  function displayResults() {
    if (!resultsContainer) return;

    resultsContainer.innerHTML = "";

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = "<p>No movies found</p>";
      return;
    }

    // Apply filters if any
    let filteredResults = [...currentResults];
    const yearValue = yearFilter ? yearFilter.value : "";
    const languageValue = languageFilter ? languageFilter.value : "";

    if (yearValue || languageValue) {
      filteredResults = currentResults.filter((movie) => {
        let matchesYear = true;
        let matchesLanguage = true;

        if (yearValue) {
          const releaseYear = movie.release_date
            ? parseInt(movie.release_date.substring(0, 4))
            : 0;

          if (yearValue === "2023") {
            matchesYear = releaseYear === 2023;
          } else if (yearValue === "2022") {
            matchesYear = releaseYear === 2022;
          } else if (yearValue === "2021") {
            matchesYear = releaseYear === 2021;
          } else if (yearValue === "2020") {
            matchesYear = releaseYear === 2020;
          } else if (yearValue === "2010s") {
            matchesYear = releaseYear >= 2010 && releaseYear <= 2019;
          } else if (yearValue === "2000s") {
            matchesYear = releaseYear >= 2000 && releaseYear <= 2009;
          } else if (yearValue === "1990s") {
            matchesYear = releaseYear >= 1990 && releaseYear <= 1999;
          } else if (yearValue === "classic") {
            matchesYear = releaseYear < 1990;
          }
        }

        if (languageValue) {
          matchesLanguage = movie.original_language === languageValue;
        }

        return matchesYear && matchesLanguage;
      });
    }

    if (filteredResults.length === 0) {
      resultsContainer.innerHTML =
        "<p>No movies match the selected filters</p>";
      return;
    }

    // Create movie cards
    filteredResults.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      // Check if in watchlist
      const inWatchlist = watchlist.some((item) => item.id === movie.id);

      // Poster URL
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/300x450/e0e0e0/999999?text=No+Poster";

      movieCard.innerHTML = `
        <button class="watchlist-btn ${inWatchlist ? "active" : ""}" data-id="${
        movie.id
      }">
          <i class="${inWatchlist ? "fas" : "far"} fa-bookmark"></i>
        </button>
        <img class="movie-poster" src="${posterUrl}" alt="${movie.title}">
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-year">${
            movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
          }</p>
          <p class="movie-language">Language: ${movie.original_language.toUpperCase()}</p>
          <div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      `;

      // Add to results
      resultsContainer.appendChild(movieCard);

      // Add event listeners
      movieCard.addEventListener("click", (e) => {
        if (!e.target.closest(".watchlist-btn")) {
          showMovieDetails(movie);
        }
      });

      const watchlistBtn = movieCard.querySelector(".watchlist-btn");
      watchlistBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWatchlist(movie, watchlistBtn);
      });
    });
  }

  // Apply filters
  function applyFilters() {
    displayResults();
  }

  // Fetch specific page
  async function fetchPage(page) {
    if (!resultsContainer) return;

    // Show loading
    resultsContainer.innerHTML = '<div class="loading"></div>';

    try {
      let apiUrl;

      if (currentSearchTerm) {
        apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          currentSearchTerm
        )}&page=${page}`;
      } else {
        apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      currentResults = data.results || [];
      totalPages = data.total_pages || 1;

      displayResults();
      updatePagination();
    } catch (error) {
      console.error("Fetch page error:", error);
      resultsContainer.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
    }
  }

  // Update pagination
  function updatePagination() {
    if (pageInfo) {
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (prevPageButton) {
      prevPageButton.disabled = currentPage <= 1;
    }

    if (nextPageButton) {
      nextPageButton.disabled = currentPage >= totalPages;
    }
  }

  // Show movie details
  function showMovieDetails(movie) {
    if (!modal || !modalContent) return;

    // Show loading
    modalContent.innerHTML = '<div class="loading"></div>';
    modal.style.display = "block";

    // Fetch details
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits,videos`
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const posterUrl = data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : "https://placehold.co/300x450/e0e0e0/999999?text=No+Poster";

        const backdropUrl = data.backdrop_path
          ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
          : null;

        const director = data.credits?.crew.find(
          (person) => person.job === "Director"
        );
        const cast = data.credits?.cast
          .slice(0, 5)
          .map((actor) => actor.name)
          .join(", ");
        const trailer = data.videos?.results.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );

        // Check if in watchlist
        const inWatchlist = watchlist.some((item) => item.id === movie.id);

        modalContent.innerHTML = `
          <span class="close-modal">&times;</span>
          <div class="modal-header" style="background-image: url('${
            backdropUrl || ""
          }')">
            <div class="modal-poster">
              <img src="${posterUrl}" alt="${data.title}">
            </div>
            <div class="modal-title">
              <h2>${data.title}</h2>
              <div class="modal-meta">
                ${
                  data.release_date ? data.release_date.substring(0, 4) : "N/A"
                } | 
                ${data.runtime ? `${data.runtime} min` : "N/A"} | 
                ${
                  data.genres
                    ? data.genres.map((g) => g.name).join(", ")
                    : "N/A"
                }
              </div>
              <div class="modal-rating">
                <i class="fas fa-star"></i>
                <span>${data.vote_average.toFixed(1)}</span>
              </div>
              <button class="modal-watchlist-btn ${
                inWatchlist ? "active" : ""
              }" data-id="${movie.id}">
                <i class="${inWatchlist ? "fas" : "far"} fa-bookmark"></i>
                ${inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
              </button>
            </div>
          </div>
          <div class="modal-body">
            <p class="modal-overview">${
              data.overview || "No overview available."
            }</p>
            <div class="modal-details">
              <p><strong>Director:</strong> ${
                director ? director.name : "N/A"
              }</p>
              <p><strong>Cast:</strong> ${cast || "N/A"}</p>
              <p><strong>Language:</strong> ${data.original_language.toUpperCase()}</p>
              <p><strong>Budget:</strong> ${
                data.budget ? `$${(data.budget / 1000000).toFixed(1)}M` : "N/A"
              }</p>
              <p><strong>Revenue:</strong> ${
                data.revenue
                  ? `$${(data.revenue / 1000000).toFixed(1)}M`
                  : "N/A"
              }</p>
            </div>
            ${
              trailer
                ? `
              <div class="modal-trailer">
                <h3>Trailer</h3>
                <div class="video-container">
                  <iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>
                </div>
              </div>
            `
                : ""
            }
          </div>
        `;

        // Add event listener to watchlist button in modal
        const modalWatchlistBtn = modalContent.querySelector(
          ".modal-watchlist-btn"
        );
        if (modalWatchlistBtn) {
          modalWatchlistBtn.addEventListener("click", () => {
            toggleWatchlist(movie, modalWatchlistBtn);

            // Update button text
            const isInWatchlist = watchlist.some(
              (item) => item.id === movie.id
            );
            modalWatchlistBtn.innerHTML = `
              <i class="${isInWatchlist ? "fas" : "far"} fa-bookmark"></i>
              ${isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
            `;
          });
        }

        // Add event listener to close button
        const closeBtn = modalContent.querySelector(".close-modal");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
          });
        }
      })
      .catch((error) => {
        console.error("Movie details error:", error);
        modalContent.innerHTML = `<p>Error loading movie details: ${error.message}</p>`;
      });
  }

  // Toggle watchlist
  function toggleWatchlist(movie, button) {
    const index = watchlist.findIndex((item) => item.id === movie.id);

    if (index === -1) {
      // Add to watchlist
      watchlist.push(movie);
      button.classList.add("active");
      button.innerHTML = '<i class="fas fa-bookmark"></i>';
      showToast(`Added "${movie.title}" to watchlist`);
    } else {
      // Remove from watchlist
      watchlist.splice(index, 1);
      button.classList.remove("active");
      button.innerHTML = '<i class="far fa-bookmark"></i>';
      showToast(`Removed "${movie.title}" from watchlist`);

      // Refresh watchlist if we're on that page
      if (
        document
          .getElementById("watchlist-section")
          .classList.contains("active")
      ) {
        displayWatchlist();
      }
    }

    // Save to localStorage
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }

  // Display watchlist
  function displayWatchlist() {
    if (!watchlistContainer) return;

    watchlistContainer.innerHTML = "";

    if (watchlist.length === 0) {
      watchlistContainer.innerHTML = `
        <div class="watchlist-empty">
          <i class="far fa-bookmark"></i>
          <h3>Your watchlist is empty</h3>
          <p>Add movies to your watchlist to keep track of what you want to watch</p>
          <button id="browse-movies-btn">Browse Movies</button>
        </div>
      `;

      const browseBtn = document.getElementById("browse-movies-btn");
      if (browseBtn) {
        browseBtn.addEventListener("click", () => {
          document.querySelector('nav a[data-section="home"]').click();
        });
      }

      return;
    }

    // Display watchlist movies
    watchlist.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/300x450/e0e0e0/999999?text=No+Poster";

      movieCard.innerHTML = `
        <button class="watchlist-btn active" data-id="${movie.id}">
          <i class="fas fa-bookmark"></i>
        </button>
        <img class="movie-poster" src="${posterUrl}" alt="${movie.title}">
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-year">${
            movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
          }</p>
          <p class="movie-language">Language: ${movie.original_language.toUpperCase()}</p>
          <div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
      `;

      watchlistContainer.appendChild(movieCard);

      // Add event listener to watchlist button
      const watchlistBtn = movieCard.querySelector(".watchlist-btn");
      watchlistBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWatchlist(movie, watchlistBtn);
      });
    });
  }

  // Add watchlist to navigation
  navLinks.forEach((link) => {
    if (link.getAttribute("data-section") === "watchlist") {
      link.addEventListener("click", displayWatchlist);
    }
  });

  // Initialize the app
  // Load popular movies on home page
  showPopularMovies();

  // Global variables for popular and categories sections
  let currentCategory = "popular";
  let popularPage = 1;
  const categoryTabs = document.querySelectorAll(".category-tab");
  const genreCards = document.querySelectorAll(".genre-card");
  const genreResults = document.getElementById("genre-results");
  const genrePagination = document.getElementById("genre-pagination");
  let currentGenreId = null;
  let genrePage = 1;

  // Set up event listeners for navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all links and add to clicked link
      navLinks.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Hide all sections and show the selected one
      const sectionId = link.getAttribute("data-section") + "-section";
      contentSections.forEach((section) => {
        section.classList.remove("active");
      });
      document.getElementById(sectionId).classList.add("active");

      // Load content based on section
      if (sectionId === "popular-section") {
        loadPopularMovies(currentCategory, 1);
      } else if (sectionId === "categories-section") {
        // Just show the genre cards initially
        if (genreResults) genreResults.innerHTML = "";
        if (genrePagination) genrePagination.style.display = "none";
      } else if (sectionId === "home-section") {
        showPopularMovies(); // Load default content for home
      }
    });
  });

  // Function to load popular movies by category
  async function loadPopularMovies(category, page) {
    if (!resultsContainer) return;

    // Show loading
    resultsContainer.innerHTML = '<div class="loading"></div>';

    try {
      let endpoint;
      switch (category) {
        case "top_rated":
          endpoint = "top_rated";
          break;
        case "upcoming":
          endpoint = "upcoming";
          break;
        case "now_playing":
          endpoint = "now_playing";
          break;
        default:
          endpoint = "popular";
      }

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${API_KEY}&page=${page}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      currentResults = data.results || [];
      totalPages = data.total_pages || 1;

      displayResults();
      updatePagination();
    } catch (error) {
      console.error("Popular movies error:", error);
      resultsContainer.innerHTML = `<p>Error loading movies: ${error.message}</p>`;
    }
  }

  // Function to load movies by genre
  async function loadGenreMovies(genreId, page) {
    if (!genreResults) return;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();

      // Remove loading indicator
      const loadingDiv = genreResults.querySelector(".loading");
      if (loadingDiv) loadingDiv.remove();

      // Display results
      if (data.results.length === 0) {
        genreResults.innerHTML += "<p>No movies found for this genre</p>";
        return;
      }

      // Create movie grid
      const moviesGrid = document.createElement("div");
      moviesGrid.classList.add("results-grid");

      data.results.forEach((movie) => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        // Check if in watchlist
        const inWatchlist = watchlist.some((item) => item.id === movie.id);

        // Poster URL
        const posterUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://placehold.co/300x450/e0e0e0/999999?text=No+Poster";

        movieCard.innerHTML = `
          <button class="watchlist-btn ${
            inWatchlist ? "active" : ""
          }" data-id="${movie.id}">
            <i class="${inWatchlist ? "fas" : "far"} fa-bookmark"></i>
          </button>
          <img class="movie-poster" src="${posterUrl}" alt="${movie.title}">
          <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <p class="movie-year">${
              movie.release_date ? movie.release_date.substring(0, 4) : "N/A"
            }</p>
            <div class="movie-rating">
              <i class="fas fa-star"></i>
              <span>${movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        `;

        moviesGrid.appendChild(movieCard);

        // Add event listeners
        movieCard.addEventListener("click", (e) => {
          if (!e.target.closest(".watchlist-btn")) {
            showMovieDetails(movie);
          }
        });

        const watchlistBtn = movieCard.querySelector(".watchlist-btn");
        watchlistBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          toggleWatchlist(movie, watchlistBtn);
        });
      });

      genreResults.appendChild(moviesGrid);

      // Update pagination
      if (genrePagination) {
        const totalPages = data.total_pages;
        const prevBtn = genrePagination.querySelector(".prev-page");
        const nextBtn = genrePagination.querySelector(".next-page");
        const pageInfo = genrePagination.querySelector(".page-info");

        if (pageInfo) pageInfo.textContent = `Page ${page} of ${totalPages}`;
        if (prevBtn) prevBtn.disabled = page <= 1;
        if (nextBtn) nextBtn.disabled = page >= totalPages;

        // Set up pagination event listeners
        if (prevBtn) {
          prevBtn.onclick = () => {
            if (page > 1) {
              genrePage--;
              genreResults.innerHTML = "";
              const heading = document.createElement("h3");
              heading.classList.add("genre-heading");
              heading.textContent =
                genreResults.querySelector(".genre-heading").textContent;
              genreResults.appendChild(heading);

              const loadingDiv = document.createElement("div");
              loadingDiv.classList.add("loading");
              genreResults.appendChild(loadingDiv);

              loadGenreMovies(currentGenreId, genrePage);
            }
          };
        }

        if (nextBtn) {
          nextBtn.onclick = () => {
            if (page < totalPages) {
              genrePage++;
              genreResults.innerHTML = "";
              const heading = document.createElement("h3");
              heading.classList.add("genre-heading");
              heading.textContent =
                genreResults.querySelector(".genre-heading").textContent;
              genreResults.appendChild(heading);

              const loadingDiv = document.createElement("div");
              loadingDiv.classList.add("loading");
              genreResults.appendChild(loadingDiv);

              loadGenreMovies(currentGenreId, genrePage);
            }
          };
        }
      }
    } catch (error) {
      console.error("Genre movies error:", error);
      genreResults.innerHTML += `<p>Error loading movies: ${error.message}</p>`;
    }
  }

  // Set up event listeners for category tabs
  if (categoryTabs) {
    categoryTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Update active tab
        categoryTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // Load movies for selected category
        currentCategory = tab.getAttribute("data-category");
        popularPage = 1;
        loadPopularMovies(currentCategory, popularPage);
      });
    });
  }

  // Set up event listeners for genre cards
  if (genreCards) {
    genreCards.forEach((card) => {
      card.addEventListener("click", () => {
        currentGenreId = card.getAttribute("data-genre-id");
        genrePage = 1;

        // Show the genre name as a heading
        const genreName = card.querySelector("h3").textContent;
        const heading = document.createElement("h3");
        heading.classList.add("genre-heading");
        heading.textContent = `${genreName} Movies`;

        // Clear previous results and add heading
        genreResults.innerHTML = "";
        genreResults.appendChild(heading);

        // Add loading indicator
        const loadingDiv = document.createElement("div");
        loadingDiv.classList.add("loading");
        genreResults.appendChild(loadingDiv);

        // Show pagination
        genrePagination.style.display = "flex";

        // Load genre movies
        loadGenreMovies(currentGenreId, genrePage);

        // Scroll to results
        genreResults.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // Toast notification function
  function showToast(message, icon = "info") {
    const toastContainer = document.getElementById("toast-container");

    if (!toastContainer) {
      console.warn("Toast container not found");
      return;
    }

    const toast = document.createElement("div");
    toast.classList.add("toast");

    let iconClass;
    switch (icon) {
      case "success":
        iconClass = "fas fa-check-circle";
        break;
      case "error":
        iconClass = "fas fa-exclamation-circle";
        break;
      case "warning":
        iconClass = "fas fa-exclamation-triangle";
        break;
      default:
        iconClass = "fas fa-info-circle";
    }

    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Remove toast after animation completes
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentNode === toastContainer) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
}); // End of DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  // Initialize the app here if needed
}); // End of DOMContentLoaded event listener
