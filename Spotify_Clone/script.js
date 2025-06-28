// Enhanced Spotify Clone with Modern Features
console.log("Welcome to Enhanced Spotify Clone");

// Application State
class SpotifyApp {
  constructor() {
    this.currentSongIndex = 0;
    this.isPlaying = false;
    this.isShuffled = false;
    this.repeatMode = "off"; // 'off', 'all', 'one'
    this.volume = 0.5;
    this.currentPlaylist = [];
    this.originalPlaylist = [];
    this.likedSongs = new Set();

    this.audioElement = document.getElementById("audioElement");
    this.initializeElements();
    this.initializeSongs();
    this.setupEventListeners();
    this.loadSongs();
    this.updateUI();
  }

  initializeElements() {
    // Player controls
    this.masterPlayBtn = document.getElementById("masterPlayBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.previousBtn = document.getElementById("previousBtn");
    this.shuffleBtn = document.getElementById("shufflePlayerBtn");
    this.repeatBtn = document.getElementById("repeatPlayerBtn");

    // Progress and volume
    this.progressBar = document.getElementById("progressBar");
    this.progressFill = document.getElementById("progressFill");
    this.volumeBar = document.getElementById("volumeBar");
    this.volumeBtn = document.getElementById("volumeBtn");

    // Current song display
    this.currentSongImage = document.getElementById("currentSongImage");
    this.currentSongTitle = document.getElementById("currentSongTitle");
    this.currentSongArtist = document.getElementById("currentSongArtist");
    this.currentTime = document.getElementById("currentTime");
    this.totalTime = document.getElementById("totalTime");

    // Other controls
    this.likeBtn = document.getElementById("likeBtn");
    this.searchInput = document.getElementById("searchInput");
    this.clearSearch = document.getElementById("clearSearch");
    this.songList = document.getElementById("songList");
    this.playAllBtn = document.getElementById("playAllBtn");
  }

  initializeSongs() {
    this.songs = [
      {
        id: 1,
        name: "Warriyo - Mortals",
        artist: "NCS Release",
        album: "NCS: The Best of 2016",
        duration: "3:50",
        filePath: "songs/1.mp3",
        coverPath: "covers/1.jpg",
      },
      {
        id: 2,
        name: "Cielo - Huma-Huma",
        artist: "NCS Release",
        album: "NCS: Gaming",
        duration: "3:35",
        filePath: "songs/2.mp3",
        coverPath: "covers/2.jpg",
      },
      {
        id: 3,
        name: "DEAF KEV - Invincible",
        artist: "NCS Release",
        album: "NCS: Uplifting",
        duration: "4:20",
        filePath: "songs/3.mp3",
        coverPath: "covers/3.jpg",
      },
      {
        id: 4,
        name: "Different Heaven & EH!DE - My Heart",
        artist: "NCS Release",
        album: "NCS: Melodic Dubstep",
        duration: "4:27",
        filePath: "songs/4.mp3",
        coverPath: "covers/4.jpg",
      },
      {
        id: 5,
        name: "Janji - Heroes Tonight",
        artist: "feat. Johnning",
        album: "NCS: The Best of 2015",
        duration: "3:28",
        filePath: "songs/5.mp3",
        coverPath: "covers/5.jpg",
      },
      {
        id: 6,
        name: "Rabbin - All of Me",
        artist: "NCS Release",
        album: "NCS: House",
        duration: "3:15",
        filePath: "songs/6.mp3",
        coverPath: "covers/6.jpg",
      },
      {
        id: 7,
        name: "Saba - Beautiful Piano Music",
        artist: "NCS Release",
        album: "NCS: Chill",
        duration: "4:12",
        filePath: "songs/7.mp3",
        coverPath: "covers/7.jpg",
      },
      {
        id: 8,
        name: "Syn Cole - Feel Good",
        artist: "NCS Release",
        album: "NCS: House",
        duration: "3:44",
        filePath: "songs/8.mp3",
        coverPath: "covers/8.jpg",
      },
      {
        id: 9,
        name: "Tobu - Hope",
        artist: "NCS Release",
        album: "NCS: Melodic Dubstep",
        duration: "4:18",
        filePath: "songs/9.mp3",
        coverPath: "covers/9.jpg",
      },
      {
        id: 10,
        name: "Elektronomia - Sky High",
        artist: "NCS Release",
        album: "NCS: The Best of 2017",
        duration: "3:53",
        filePath: "songs/10.mp3",
        coverPath: "covers/10.jpg",
      },
    ];

    this.originalPlaylist = [...this.songs];
    this.currentPlaylist = [...this.songs];
  }
  setupEventListeners() {
    // Audio events
    this.audioElement.addEventListener("loadedmetadata", () =>
      this.updateDuration()
    );
    this.audioElement.addEventListener("timeupdate", () =>
      this.updateProgress()
    );
    this.audioElement.addEventListener("ended", () => this.handleSongEnd());
    this.audioElement.addEventListener("error", (e) =>
      this.handleAudioError(e)
    );

    // Player controls
    this.masterPlayBtn.addEventListener("click", () => this.togglePlayPause());
    this.nextBtn.addEventListener("click", () => this.nextSong());
    this.previousBtn.addEventListener("click", () => this.previousSong());
    this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
    this.repeatBtn.addEventListener("click", () => this.toggleRepeat());

    // Progress bar
    this.progressBar.addEventListener("input", () => this.seekSong());
    this.progressBar.addEventListener("change", () => this.seekSong());

    // Volume control
    this.volumeBar.addEventListener("input", () => this.updateVolume());
    this.volumeBtn.addEventListener("click", () => this.toggleMute());

    // Search functionality
    this.searchInput.addEventListener("input", () => this.handleSearch());
    this.clearSearch.addEventListener("click", () => this.clearSearchInput());

    // Other controls
    this.likeBtn.addEventListener("click", () => this.toggleLike());
    this.playAllBtn.addEventListener("click", () => this.playAll());

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));
  }

  loadSongs() {
    this.songList.innerHTML = "";

    this.currentPlaylist.forEach((song, index) => {
      const songItem = this.createSongItem(song, index);
      this.songList.appendChild(songItem);
    });
  }

  createSongItem(song, index) {
    const songItem = document.createElement("div");
    songItem.className = "song-item";
    songItem.dataset.index = index;

    songItem.innerHTML = `
            <div class="song-number-container">
                <span class="song-number">${index + 1}</span>
                <button class="play-btn" style="display: none;">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="song-info">
                <img src="${song.coverPath}" alt="${
      song.name
    }" class="song-cover">
                <div class="song-details">
                    <div class="song-name">${song.name}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            </div>
            <div class="song-album">${song.album}</div>
            <div class="song-duration">${song.duration}</div>
        `;

    // Add click event to play song
    songItem.addEventListener("click", () => this.playSong(index));

    return songItem;
  }

  playSong(index) {
    this.currentSongIndex = index;
    const song = this.currentPlaylist[index];

    this.audioElement.src = song.filePath;
    this.audioElement.load();

    if (this.isPlaying) {
      this.audioElement
        .play()
        .catch((e) => console.error("Error playing audio:", e));
    }

    this.updateCurrentSongDisplay();
    this.updateUI();
  }

  togglePlayPause() {
    if (this.audioElement.paused) {
      this.audioElement
        .play()
        .then(() => {
          this.isPlaying = true;
          this.updateUI();
        })
        .catch((e) => console.error("Error playing audio:", e));
    } else {
      this.audioElement.pause();
      this.isPlaying = false;
      this.updateUI();
    }
  }

  nextSong() {
    if (this.repeatMode === "one") {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
      return;
    }

    let nextIndex;
    if (this.isShuffled) {
      nextIndex = Math.floor(Math.random() * this.currentPlaylist.length);
    } else {
      nextIndex = (this.currentSongIndex + 1) % this.currentPlaylist.length;
    }

    this.playSong(nextIndex);
    if (this.isPlaying) {
      this.audioElement.play();
    }
  }

  previousSong() {
    if (this.audioElement.currentTime > 3) {
      this.audioElement.currentTime = 0;
      return;
    }

    let prevIndex;
    if (this.isShuffled) {
      prevIndex = Math.floor(Math.random() * this.currentPlaylist.length);
    } else {
      prevIndex =
        this.currentSongIndex === 0
          ? this.currentPlaylist.length - 1
          : this.currentSongIndex - 1;
    }

    this.playSong(prevIndex);
    if (this.isPlaying) {
      this.audioElement.play();
    }
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.shuffleBtn.classList.toggle("active", this.isShuffled);

    if (this.isShuffled) {
      this.shufflePlaylist();
    } else {
      this.currentPlaylist = [...this.originalPlaylist];
      this.loadSongs();
    }
  }

  shufflePlaylist() {
    const currentSong = this.currentPlaylist[this.currentSongIndex];
    const shuffled = [...this.currentPlaylist];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.currentPlaylist = shuffled;
    this.currentSongIndex = this.currentPlaylist.findIndex(
      (song) => song.id === currentSong.id
    );
    this.loadSongs();
  }

  toggleRepeat() {
    const modes = ["off", "all", "one"];
    const currentIndex = modes.indexOf(this.repeatMode);
    this.repeatMode = modes[(currentIndex + 1) % modes.length];

    this.repeatBtn.classList.toggle("active", this.repeatMode !== "off");

    const icon = this.repeatBtn.querySelector("i");
    if (this.repeatMode === "one") {
      icon.className = "fas fa-redo-alt";
    } else {
      icon.className = "fas fa-redo";
    }
  }

  handleSongEnd() {
    if (this.repeatMode === "one") {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
    } else if (
      this.repeatMode === "all" ||
      this.currentSongIndex < this.currentPlaylist.length - 1
    ) {
      this.nextSong();
    } else {
      this.isPlaying = false;
      this.updateUI();
    }
  }

  updateProgress() {
    if (this.audioElement.duration) {
      const progress =
        (this.audioElement.currentTime / this.audioElement.duration) * 100;
      this.progressBar.value = progress;
      this.progressFill.style.width = `${progress}%`;

      this.currentTime.textContent = this.formatTime(
        this.audioElement.currentTime
      );
    }
  }

  updateDuration() {
    if (this.audioElement.duration) {
      this.totalTime.textContent = this.formatTime(this.audioElement.duration);
    }
  }

  seekSong() {
    if (this.audioElement.duration) {
      const seekTime =
        (this.progressBar.value / 100) * this.audioElement.duration;
      this.audioElement.currentTime = seekTime;
    }
  }

  updateVolume() {
    this.volume = this.volumeBar.value / 100;
    this.audioElement.volume = this.volume;

    const volumeIcon = this.volumeBtn.querySelector("i");
    if (this.volume === 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (this.volume < 0.5) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  }

  toggleMute() {
    if (this.audioElement.volume > 0) {
      this.previousVolume = this.audioElement.volume;
      this.audioElement.volume = 0;
      this.volumeBar.value = 0;
    } else {
      this.audioElement.volume = this.previousVolume || 0.5;
      this.volumeBar.value = (this.previousVolume || 0.5) * 100;
    }
    this.updateVolume();
  }

  handleSearch() {
    const query = this.searchInput.value.toLowerCase().trim();

    if (query === "") {
      this.currentPlaylist = [...this.originalPlaylist];
    } else {
      this.currentPlaylist = this.originalPlaylist.filter(
        (song) =>
          song.name.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query)
      );
    }

    this.loadSongs();
    this.clearSearch.style.display = query ? "block" : "none";
  }

  clearSearchInput() {
    this.searchInput.value = "";
    this.handleSearch();
  }

  toggleLike() {
    const currentSong = this.currentPlaylist[this.currentSongIndex];
    if (this.likedSongs.has(currentSong.id)) {
      this.likedSongs.delete(currentSong.id);
      this.likeBtn.classList.remove("liked");
      this.likeBtn.querySelector("i").className = "far fa-heart";
    } else {
      this.likedSongs.add(currentSong.id);
      this.likeBtn.classList.add("liked");
      this.likeBtn.querySelector("i").className = "fas fa-heart";
    }
  }

  playAll() {
    this.playSong(0);
    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.updateUI();
    });
  }

  handleKeyboard(e) {
    switch (e.code) {
      case "Space":
        e.preventDefault();
        this.togglePlayPause();
        break;
      case "ArrowRight":
        if (e.ctrlKey) {
          e.preventDefault();
          this.nextSong();
        }
        break;
      case "ArrowLeft":
        if (e.ctrlKey) {
          e.preventDefault();
          this.previousSong();
        }
        break;
      case "ArrowUp":
        if (e.ctrlKey) {
          e.preventDefault();
          this.volumeBar.value = Math.min(
            100,
            parseInt(this.volumeBar.value) + 10
          );
          this.updateVolume();
        }
        break;
      case "ArrowDown":
        if (e.ctrlKey) {
          e.preventDefault();
          this.volumeBar.value = Math.max(
            0,
            parseInt(this.volumeBar.value) - 10
          );
          this.updateVolume();
        }
        break;
    }
  }

  updateCurrentSongDisplay() {
    const currentSong = this.currentPlaylist[this.currentSongIndex];
    if (currentSong) {
      this.currentSongImage.src = currentSong.coverPath;
      this.currentSongTitle.textContent = currentSong.name;
      this.currentSongArtist.textContent = currentSong.artist;

      // Update like button
      if (this.likedSongs.has(currentSong.id)) {
        this.likeBtn.classList.add("liked");
        this.likeBtn.querySelector("i").className = "fas fa-heart";
      } else {
        this.likeBtn.classList.remove("liked");
        this.likeBtn.querySelector("i").className = "far fa-heart";
      }
    }
  }

  updateUI() {
    // Update play button
    const playIcon = this.masterPlayBtn.querySelector("i");
    if (this.isPlaying && !this.audioElement.paused) {
      playIcon.className = "fas fa-pause";
    } else {
      playIcon.className = "fas fa-play";
    }

    // Update song items
    document.querySelectorAll(".song-item").forEach((item, index) => {
      item.classList.toggle(
        "playing",
        index === this.currentSongIndex && this.isPlaying
      );
    });

    // Update play all button
    const playAllIcon = this.playAllBtn.querySelector("i");
    if (this.isPlaying) {
      playAllIcon.className = "fas fa-pause";
    } else {
      playAllIcon.className = "fas fa-play";
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  handleAudioError(e) {
    console.error("Audio error:", e);
    // You could show a user-friendly error message here
    this.nextSong(); // Skip to next song on error
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  window.spotifyApp = new SpotifyApp();
});

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = SpotifyApp;
}
