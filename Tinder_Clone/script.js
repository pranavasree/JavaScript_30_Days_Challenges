class TinderApp {
  constructor() {
    this.currentCardIndex = 0;
    this.profiles = [];
    this.matches = [];
    this.conversations = [];
    this.currentUser = {
      name: "Alex",
      age: 25,
      photo: "https://picsum.photos/150/150?random=100",
      bio: "Love traveling, coffee, and good conversations. Looking for someone to explore the city with! 🌟",
      interests: ["Travel", "Coffee", "Photography", "Music", "Hiking"],
    };

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;

    this.init();
  }

  init() {
    this.generateProfiles();
    this.setupEventListeners();
    this.renderCards();
    this.setupMatches();
    this.setupConversations();
    this.hideLoadingScreen();
  }

  generateProfiles() {
    const names = [
      "Sarah",
      "Emma",
      "Jessica",
      "Ashley",
      "Amanda",
      "Jennifer",
      "Stephanie",
      "Nicole",
      "Michael",
      "David",
      "James",
      "John",
      "Robert",
      "Christopher",
      "Daniel",
      "Matthew",
      "Lisa",
      "Michelle",
      "Kimberly",
      "Amy",
      "Angela",
      "Tiffany",
      "Heather",
      "Rachel",
    ];

    const bios = [
      "Adventure seeker and coffee enthusiast ☕",
      "Love hiking, yoga, and good vibes 🧘‍♀️",
      "Foodie exploring the city one restaurant at a time 🍕",
      "Dog lover and weekend warrior 🐕",
      "Artist by day, Netflix binger by night 🎨",
      "Fitness enthusiast and smoothie addict 💪",
      "Travel blogger with wanderlust ✈️",
      "Music lover and concert goer 🎵",
      "Bookworm seeking intellectual conversations 📚",
      "Photographer capturing life's moments 📸",
      "Chef experimenting with new recipes 👨‍🍳",
      "Outdoor enthusiast and nature lover 🌲",
      "Tech geek and startup founder 💻",
      "Dancer with rhythm in my soul 💃",
      "Wine connoisseur and cheese lover 🍷",
    ];

    const interests = [
      ["Travel", "Photography", "Coffee"],
      ["Fitness", "Yoga", "Hiking"],
      ["Food", "Cooking", "Wine"],
      ["Music", "Concerts", "Dancing"],
      ["Art", "Museums", "Culture"],
      ["Books", "Writing", "Poetry"],
      ["Sports", "Running", "Cycling"],
      ["Movies", "Netflix", "Theater"],
      ["Technology", "Gaming", "Innovation"],
      ["Nature", "Camping", "Adventure"],
    ];

    for (let i = 0; i < 20; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const age = Math.floor(Math.random() * 15) + 22; // 22-36
      const distance = Math.floor(Math.random() * 20) + 1; // 1-20 km
      const bio = bios[Math.floor(Math.random() * bios.length)];
      const userInterests =
        interests[Math.floor(Math.random() * interests.length)];

      this.profiles.push({
        id: i + 1,
        name,
        age,
        distance,
        bio,
        interests: userInterests,
        photos: [
          `https://picsum.photos/400/600?random=${i + 200}`,
          `https://picsum.photos/400/600?random=${i + 300}`,
          `https://picsum.photos/400/600?random=${i + 400}`,
        ],
        verified: Math.random() > 0.7,
      });
    }
  }

  setupEventListeners() {
    // Action buttons
    document
      .getElementById("passBtn")
      .addEventListener("click", () => this.passCard());
    document
      .getElementById("likeBtn")
      .addEventListener("click", () => this.likeCard());
    document
      .getElementById("superLikeBtn")
      .addEventListener("click", () => this.superLikeCard());
    document
      .getElementById("boostBtn")
      .addEventListener("click", () => this.showBoostMessage());
    document
      .getElementById("rewindBtn")
      .addEventListener("click", () => this.rewindCard());
    document
      .getElementById("reloadBtn")
      .addEventListener("click", () => this.reloadCards());

    // Modal controls
    document
      .getElementById("profileBtn")
      .addEventListener("click", () => this.showProfileModal());
    document
      .getElementById("chatBtn")
      .addEventListener("click", () => this.showChatModal());
    document
      .getElementById("closeProfile")
      .addEventListener("click", () => this.hideProfileModal());
    document
      .getElementById("closeChat")
      .addEventListener("click", () => this.hideChatModal());

    // Match modal
    document
      .getElementById("keepSwiping")
      .addEventListener("click", () => this.hideMatchModal());
    document
      .getElementById("sendMessage")
      .addEventListener("click", () => this.openChatFromMatch());

    // Chat navigation
    document
      .getElementById("backToMatches")
      .addEventListener("click", () => this.showMatchesList());
    document
      .getElementById("backToList")
      .addEventListener("click", () => this.showMatchesList());

    // Message sending
    document
      .getElementById("sendBtn")
      .addEventListener("click", () => this.sendMessage());

    const messageInput = document.getElementById("messageInput");
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.sendMessage();
    });

    // Ensure input is visible when focused
    messageInput.addEventListener("focus", () => {
      setTimeout(() => {
        this.ensureInputVisible();
      }, 300); // Wait for mobile keyboard animation
    });

    // Handle mobile keyboard showing/hiding
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => {
        setTimeout(() => {
          this.ensureInputVisible();
        }, 100);
      });
    }

    // Profile settings
    document
      .getElementById("maxDistance")
      .addEventListener("input", this.updateDistanceValue);
    document
      .getElementById("minAge")
      .addEventListener("input", this.updateAgeRange);
    document
      .getElementById("maxAge")
      .addEventListener("input", this.updateAgeRange);

    // Touch/mouse events for card swiping
    this.setupCardSwipeEvents();

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key) {
        case "ArrowLeft":
          this.passCard();
          break;
        case "ArrowRight":
          this.likeCard();
          break;
        case "ArrowUp":
          this.superLikeCard();
          break;
        case " ":
          e.preventDefault();
          this.showProfileModal();
          break;
      }
    });
  }

  setupCardSwipeEvents() {
    const cardStack = document.getElementById("cardStack");

    // Mouse events
    cardStack.addEventListener("mousedown", this.handleStart.bind(this));
    document.addEventListener("mousemove", this.handleMove.bind(this));
    document.addEventListener("mouseup", this.handleEnd.bind(this));

    // Touch events
    cardStack.addEventListener("touchstart", this.handleStart.bind(this), {
      passive: false,
    });
    document.addEventListener("touchmove", this.handleMove.bind(this), {
      passive: false,
    });
    document.addEventListener("touchend", this.handleEnd.bind(this));
  }

  handleStart(e) {
    const card = e.target.closest(".profile-card");
    if (!card || card !== document.querySelector(".profile-card:first-child"))
      return;

    this.isDragging = true;
    card.classList.add("dragging");

    const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === "mousedown" ? e.clientY : e.touches[0].clientY;

    this.startX = clientX;
    this.startY = clientY;
    this.currentX = clientX;
    this.currentY = clientY;

    e.preventDefault();
  }

  handleMove(e) {
    if (!this.isDragging) return;

    const card = document.querySelector(".profile-card:first-child");
    if (!card) return;

    const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
    const clientY = e.type === "mousemove" ? e.clientY : e.touches[0].clientY;

    this.currentX = clientX;
    this.currentY = clientY;

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;
    const rotation = deltaX * 0.1;

    card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
    card.style.opacity = 1 - Math.abs(deltaX) / 300;

    // Show swipe indicators
    const likeIndicator = document.getElementById("likeIndicator");
    const passIndicator = document.getElementById("passIndicator");

    if (deltaX > 50) {
      likeIndicator.classList.add("show");
      passIndicator.classList.remove("show");
    } else if (deltaX < -50) {
      passIndicator.classList.add("show");
      likeIndicator.classList.remove("show");
    } else {
      likeIndicator.classList.remove("show");
      passIndicator.classList.remove("show");
    }

    e.preventDefault();
  }

  handleEnd(e) {
    if (!this.isDragging) return;

    const card = document.querySelector(".profile-card:first-child");
    if (!card) return;

    this.isDragging = false;
    card.classList.remove("dragging");

    const deltaX = this.currentX - this.startX;
    const deltaY = this.currentY - this.startY;

    // Hide indicators
    document.getElementById("likeIndicator").classList.remove("show");
    document.getElementById("passIndicator").classList.remove("show");

    // Determine swipe action
    if (Math.abs(deltaX) > 100) {
      if (deltaX > 0) {
        this.likeCard();
      } else {
        this.passCard();
      }
    } else if (deltaY < -100) {
      this.superLikeCard();
    } else {
      // Snap back to center
      card.style.transform = "";
      card.style.opacity = "";
    }
  }

  renderCards() {
    const cardStack = document.getElementById("cardStack");
    cardStack.innerHTML = "";

    // Show up to 3 cards in stack
    for (
      let i = 0;
      i < Math.min(3, this.profiles.length - this.currentCardIndex);
      i++
    ) {
      const profile = this.profiles[this.currentCardIndex + i];
      if (!profile) continue;

      const card = this.createProfileCard(profile);
      cardStack.appendChild(card);
    }

    // Check if no more cards
    if (this.currentCardIndex >= this.profiles.length) {
      document.getElementById("noMoreCards").style.display = "flex";
      cardStack.style.display = "none";
    } else {
      document.getElementById("noMoreCards").style.display = "none";
      cardStack.style.display = "flex";
    }
  }

  createProfileCard(profile) {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `
            <div class="card-image">
                <img src="${profile.photos[0]}" alt="${
      profile.name
    }" loading="lazy">
                <div class="card-gradient"></div>
                <div class="card-info">
                    <div class="card-name-age">
                        <span class="card-name">${profile.name}</span>
                        <span class="card-age">${profile.age}</span>
                        ${
                          profile.verified
                            ? '<i class="fas fa-check-circle" style="color: #42CDD4; margin-left: 8px;"></i>'
                            : ""
                        }
                    </div>
                    <div class="card-distance">${profile.distance} km away</div>
                    <div class="card-bio">${profile.bio}</div>
                    <div class="card-interests">
                        ${profile.interests
                          .map(
                            (interest) =>
                              `<span class="interest-tag">${interest}</span>`
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `;
    return card;
  }

  passCard() {
    this.swipeCard("left");
  }

  likeCard() {
    const profile = this.profiles[this.currentCardIndex];
    if (profile) {
      // 30% chance of match
      if (Math.random() < 0.3) {
        this.createMatch(profile);
      }
    }
    this.swipeCard("right");
  }

  superLikeCard() {
    const profile = this.profiles[this.currentCardIndex];
    if (profile) {
      // 60% chance of match with super like
      if (Math.random() < 0.6) {
        this.createMatch(profile);
      }
      this.showSuperLikeAnimation();
    }
    this.swipeCard("up");
  }

  swipeCard(direction) {
    const card = document.querySelector(".profile-card:first-child");
    if (!card) return;

    card.classList.add(`swiped-${direction}`);

    setTimeout(() => {
      this.currentCardIndex++;
      this.renderCards();
    }, 300);
  }

  rewindCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
      this.renderCards();
      this.showNotification("Rewound last swipe!");
    } else {
      this.showNotification("No more cards to rewind");
    }
  }

  reloadCards() {
    this.currentCardIndex = 0;
    this.generateProfiles();
    this.renderCards();
    this.showNotification("New profiles loaded!");
  }

  createMatch(profile) {
    this.matches.push({
      id: profile.id,
      name: profile.name,
      photo: profile.photos[0],
      matchedAt: new Date(),
    });

    // Create conversation
    this.conversations.push({
      id: profile.id,
      name: profile.name,
      photo: profile.photos[0],
      messages: [
        {
          id: 1,
          text: `Hey ${this.currentUser.name}! Thanks for the super like! 😊`,
          sent: false,
          timestamp: new Date(),
        },
      ],
      lastMessage: `Hey ${this.currentUser.name}! Thanks for the super like! 😊`,
      lastMessageTime: new Date(),
      unread: true,
    });

    this.updateChatBadge();
    this.showMatchModal(profile);
  }

  showMatchModal(profile) {
    const modal = document.getElementById("matchModal");
    const matchName = document.getElementById("matchName");
    const matchPhoto = document.getElementById("matchPhoto");

    matchName.textContent = profile.name;
    matchPhoto.src = profile.photos[0];

    modal.classList.add("show");
  }

  hideMatchModal() {
    document.getElementById("matchModal").classList.remove("show");
  }

  openChatFromMatch() {
    this.hideMatchModal();
    this.showChatModal();
    // Open specific conversation
    const lastMatch = this.matches[this.matches.length - 1];
    if (lastMatch) {
      this.openConversation(lastMatch.id);
    }
  }

  showSuperLikeAnimation() {
    const animation = document.getElementById("superLikeAnimation");
    animation.classList.add("show");
    setTimeout(() => {
      animation.classList.remove("show");
    }, 1000);
  }

  showBoostMessage() {
    this.showNotification(
      "Boost activated! You'll be one of the top profiles in your area for 30 minutes."
    );
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--tinder-primary);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-weight: 500;
            z-index: 3000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => (notification.style.opacity = "1"), 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  }

  showProfileModal() {
    document.getElementById("profileModal").classList.add("show");
  }

  hideProfileModal() {
    document.getElementById("profileModal").classList.remove("show");
  }

  showChatModal() {
    document.getElementById("chatModal").classList.add("show");
    this.renderMatches();
    this.renderConversations();
  }

  hideChatModal() {
    document.getElementById("chatModal").classList.remove("show");
    this.showMatchesList();
  }

  showMatchesList() {
    document.getElementById("matchesList").style.display = "block";
    document.getElementById("chatConversation").style.display = "none";
  }

  renderMatches() {
    const matchesGrid = document.getElementById("matchesGrid");
    matchesGrid.innerHTML = "";

    this.matches.slice(-6).forEach((match) => {
      const matchElement = document.createElement("div");
      matchElement.className = "match-item";
      matchElement.innerHTML = `
                <img src="${match.photo}" alt="${match.name}">
                <span>${match.name}</span>
            `;
      matchElement.addEventListener("click", () =>
        this.openConversation(match.id)
      );
      matchesGrid.appendChild(matchElement);
    });
  }

  renderConversations() {
    const conversationsList = document.getElementById("conversationsList");
    conversationsList.innerHTML = "";

    this.conversations.forEach((conversation) => {
      const conversationElement = document.createElement("div");
      conversationElement.className = "conversation-item";
      conversationElement.innerHTML = `
                <img src="${conversation.photo}" alt="${conversation.name}">
                <div class="conversation-info">
                    <div class="conversation-name">${conversation.name}</div>
                    <div class="conversation-preview">${
                      conversation.lastMessage
                    }</div>
                </div>
                <div class="conversation-time">${this.formatTime(
                  conversation.lastMessageTime
                )}</div>
                ${
                  conversation.unread
                    ? '<div class="unread-indicator"></div>'
                    : ""
                }
            `;
      conversationElement.addEventListener("click", () =>
        this.openConversation(conversation.id)
      );
      conversationsList.appendChild(conversationElement);
    });
  }

  openConversation(userId) {
    const conversation = this.conversations.find((c) => c.id === userId);
    if (!conversation) return;

    // Mark as read
    conversation.unread = false;
    this.updateChatBadge();

    // Show conversation
    document.getElementById("matchesList").style.display = "none";
    document.getElementById("chatConversation").style.display = "flex";

    // Update header
    document.getElementById("chatUserName").textContent = conversation.name;
    document.getElementById("chatUserPhoto").src = conversation.photo;

    // Render messages
    this.renderMessages(conversation);
  }

  renderMessages(conversation) {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = "";

    conversation.messages.forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.className = `message ${
        message.sent ? "sent" : "received"
      }`;
      messageElement.innerHTML = `
                ${message.text}
                <div class="message-time">${this.formatTime(
                  message.timestamp
                )}</div>
            `;
      messagesContainer.appendChild(messageElement);
    });

    // Scroll to bottom with smooth animation
    this.scrollToBottom(messagesContainer);
  }

  scrollToBottom(container) {
    // Use requestAnimationFrame for smooth scrolling
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }

  ensureInputVisible() {
    const messageInput = document.getElementById("messageInput");
    const inputContainer = messageInput.closest(".message-input-container");

    if (inputContainer) {
      // Ensure the input container is visible
      inputContainer.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }

  sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (!messageText) return;

    // Find current conversation
    const chatUserName = document.getElementById("chatUserName").textContent;
    const conversation = this.conversations.find(
      (c) => c.name === chatUserName
    );

    if (!conversation) return;

    // Add message
    const newMessage = {
      id: conversation.messages.length + 1,
      text: messageText,
      sent: true,
      timestamp: new Date(),
    };

    conversation.messages.push(newMessage);
    conversation.lastMessage = messageText;
    conversation.lastMessageTime = new Date();

    // Clear input
    messageInput.value = "";

    // Re-render messages
    this.renderMessages(conversation);

    // Ensure input remains visible
    setTimeout(() => {
      this.ensureInputVisible();
    }, 100);

    // Simulate response after 2-5 seconds
    setTimeout(() => {
      this.simulateResponse(conversation);
    }, Math.random() * 3000 + 2000);
  }

  simulateResponse(conversation) {
    const responses = [
      "That sounds amazing! 😊",
      "I'd love to hear more about that!",
      "Haha, you're funny! 😄",
      "What do you think about grabbing coffee sometime?",
      "I totally agree with you!",
      "That's so interesting! Tell me more.",
      "You seem really cool! 😎",
      "I love your sense of humor!",
      "What are you up to this weekend?",
      "That place sounds great! I've been wanting to try it.",
    ];

    const responseText =
      responses[Math.floor(Math.random() * responses.length)];

    const responseMessage = {
      id: conversation.messages.length + 1,
      text: responseText,
      sent: false,
      timestamp: new Date(),
    };

    conversation.messages.push(responseMessage);
    conversation.lastMessage = responseText;
    conversation.lastMessageTime = new Date();
    conversation.unread = true;

    // Update UI if conversation is currently open
    const currentChatName = document.getElementById("chatUserName").textContent;
    if (currentChatName === conversation.name) {
      this.renderMessages(conversation);
      conversation.unread = false;

      // Ensure input remains visible after new message
      setTimeout(() => {
        this.ensureInputVisible();
      }, 100);
    }

    this.updateChatBadge();
  }

  updateChatBadge() {
    const unreadCount = this.conversations.filter((c) => c.unread).length;
    const badge = document.getElementById("chatBadge");

    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  }

  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return date.toLocaleDateString();
  }

  updateDistanceValue() {
    const slider = document.getElementById("maxDistance");
    const value = document.querySelector(".range-value");
    value.textContent = `${slider.value} km`;
  }

  updateAgeRange() {
    const minAge = document.getElementById("minAge").value;
    const maxAge = document.getElementById("maxAge").value;
    const display = document.querySelector(".age-display");
    display.textContent = `${minAge} - ${maxAge}`;
  }

  setupMatches() {
    // Pre-populate some matches for demo
    const demoMatches = [
      {
        id: 101,
        name: "Sarah",
        photo: "https://picsum.photos/150/150?random=101",
      },
      {
        id: 102,
        name: "Emma",
        photo: "https://picsum.photos/150/150?random=102",
      },
      {
        id: 103,
        name: "Jessica",
        photo: "https://picsum.photos/150/150?random=103",
      },
    ];

    this.matches = demoMatches;
  }

  setupConversations() {
    // Pre-populate some conversations for demo
    const demoConversations = [
      {
        id: 101,
        name: "Sarah",
        photo: "https://picsum.photos/150/150?random=101",
        messages: [
          {
            id: 1,
            text: "Hey! Thanks for the like! 😊",
            sent: false,
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          },
          {
            id: 2,
            text: "Hi Sarah! You seem really interesting!",
            sent: true,
            timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
          },
          {
            id: 3,
            text: "Aww thank you! I love your photos. Are you into hiking?",
            sent: false,
            timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          },
        ],
        lastMessage: "Aww thank you! I love your photos. Are you into hiking?",
        lastMessageTime: new Date(Date.now() - 1800000),
        unread: true,
      },
      {
        id: 102,
        name: "Emma",
        photo: "https://picsum.photos/150/150?random=102",
        messages: [
          {
            id: 1,
            text: "Coffee date this weekend? ☕",
            sent: false,
            timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          },
        ],
        lastMessage: "Coffee date this weekend? ☕",
        lastMessageTime: new Date(Date.now() - 7200000),
        unread: true,
      },
    ];

    this.conversations = demoConversations;
    this.updateChatBadge();
  }

  hideLoadingScreen() {
    setTimeout(() => {
      document.getElementById("loadingScreen").classList.add("hide");
    }, 2000);
  }
}

// PWA Installation
class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.setupInstallPrompt();
    this.setupServiceWorker();
  }

  setupInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("PWA: Install prompt available");
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener("appinstalled", () => {
      console.log("PWA: App installed successfully");
      this.hideInstallButton();
      this.deferredPrompt = null;
    });
  }

  showInstallButton() {
    // Create install button if it doesn't exist
    if (!document.getElementById("installBtn")) {
      const installBtn = document.createElement("button");
      installBtn.id = "installBtn";
      installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
      installBtn.className = "install-btn";
      installBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--tinder-primary);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(253, 80, 104, 0.3);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

      installBtn.addEventListener("click", () => this.installApp());
      document.body.appendChild(installBtn);
    }
  }

  hideInstallButton() {
    const installBtn = document.getElementById("installBtn");
    if (installBtn) {
      installBtn.remove();
    }
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log(`PWA: User ${outcome} the install prompt`);
    this.deferredPrompt = null;
    this.hideInstallButton();
  }

  setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log(
            "PWA: Service Worker registered successfully",
            registration
          );

          // Handle service worker updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                this.showUpdateNotification();
              }
            });
          });
        } catch (error) {
          console.error("PWA: Service Worker registration failed", error);
        }
      });
    }
  }

  showUpdateNotification() {
    const notification = document.createElement("div");
    notification.className = "update-notification";
    notification.innerHTML = `
            <div class="update-content">
                <span>New version available!</span>
                <button onclick="window.location.reload()">Update</button>
            </div>
        `;
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-primary);
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 2000;
            border: 1px solid var(--tinder-primary);
        `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}

// Web App Features
function setupWebAppFeatures() {
  // Prevent zoom on double tap (iOS)
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (event) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false
  );

  // Handle app visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("App: Hidden");
    } else {
      console.log("App: Visible");
    }
  });

  // Handle online/offline status
  window.addEventListener("online", () => {
    console.log("App: Online");
    showConnectionStatus("Connected", "success");
  });

  window.addEventListener("offline", () => {
    console.log("App: Offline");
    showConnectionStatus("Offline", "error");
  });
}

function showConnectionStatus(message, type) {
  const status = document.createElement("div");
  status.className = `connection-status ${type}`;
  status.textContent = message;
  status.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 25px;
        color: white;
        font-weight: 600;
        z-index: 2000;
        background: ${type === "success" ? "#42D742" : "#FF6B6B"};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(status);

  setTimeout(() => {
    status.style.opacity = "0";
    setTimeout(() => status.remove(), 300);
  }, 2000);
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TinderApp();
  new PWAInstaller();
  setupWebAppFeatures();
});
