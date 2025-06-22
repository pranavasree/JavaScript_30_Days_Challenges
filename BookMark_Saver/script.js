const addBookmarkBtn = document.getElementById("add-bookmark");
const bookmarkList = document.getElementById("bookmark-list");
const bookmarkNameInput = document.getElementById("bookmark-name");
const bookmarkUrlInput = document.getElementById("bookmark-url");
const bookmarkCategoryInput = document.getElementById("bookmark-category"); // New: Category input
const searchBookmarksInput = document.getElementById("search-bookmarks"); // New: Search input
const filterCategorySelect = document.getElementById("filter-category"); // New: Filter dropdown
let editingBookmark = null; // New: Track bookmark being edited

document.addEventListener("DOMContentLoaded", loadBookmarks);

addBookmarkBtn.addEventListener("click", function () {
  const name = bookmarkNameInput.value.trim();
  const url = bookmarkUrlInput.value.trim();
  const category = bookmarkCategoryInput.value; // New: Get category

  if (!name || !url) {
    alert("Please enter both name and URL.");
    return;
  } else {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    if (editingBookmark) {
      // New: Update existing bookmark
      updateBookmark(editingBookmark, name, url, category);
      editingBookmark = null;
      addBookmarkBtn.textContent = "Add Bookmark";
    } else {
      addBookmark(name, url, category);
      saveBookmark(name, url, category);
    }
    bookmarkNameInput.value = "";
    bookmarkUrlInput.value = "";
    bookmarkCategoryInput.value = "uncategorized"; // New: Reset category
  }
});

// New: Search functionality
searchBookmarksInput.addEventListener("input", function () {
  const searchTerm = searchBookmarksInput.value.toLowerCase();
  const bookmarks = bookmarkList.querySelectorAll("li");
  bookmarks.forEach((li) => {
    const name = li.querySelector("a").textContent.toLowerCase();
    const url = li.querySelector("a").href.toLowerCase();
    li.style.display =
      name.includes(searchTerm) || url.includes(searchTerm) ? "" : "none";
  });
});

// New: Filter by category
filterCategorySelect.addEventListener("change", function () {
  const selectedCategory = filterCategorySelect.value;
  const bookmarks = bookmarkList.querySelectorAll("li");
  bookmarks.forEach((li) => {
    const category = li.dataset.category;
    li.style.display =
      selectedCategory === "all" || category === selectedCategory ? "" : "none";
  });
});

function addBookmark(name, url, category = "uncategorized") {
  const li = document.createElement("li");
  li.dataset.category = category; // New: Store category in data attribute
  const link = document.createElement("a");
  link.href = url;
  link.textContent = `${name} (${category})`; // New: Show category in display
  link.target = "_blank";

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", function () {
    bookmarkList.removeChild(li);
    removeBookmarkFromStorage(name, url);
  });

  // New: Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit"; // Add class for styling
  editButton.addEventListener("click", function () {
    bookmarkNameInput.value = name;
    bookmarkUrlInput.value = url;
    bookmarkCategoryInput.value = category;
    addBookmarkBtn.textContent = "Update Bookmark";
    editingBookmark = { li, name, url, category }; // Track bookmark for editing
  });

  li.appendChild(link);
  li.appendChild(editButton); // New: Append edit button
  li.appendChild(removeButton);

  bookmarkList.appendChild(li);
}

function getBookmarksFromStorage() {
  const bookmarks = localStorage.getItem("bookmarks");
  return bookmarks ? JSON.parse(bookmarks) : [];
}

function saveBookmark(name, url, category) {
  const bookmarks = getBookmarksFromStorage();
  bookmarks.push({ name, url, category }); // New: Include category
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function loadBookmarks() {
  const bookmarks = getBookmarksFromStorage();
  bookmarks.forEach((bookmark) =>
    addBookmark(bookmark.name, bookmark.url, bookmark.category)
  );
}

function removeBookmarkFromStorage(name, url) {
  let bookmarks = getBookmarksFromStorage();
  bookmarks = bookmarks.filter(
    (bookmark) => bookmark.name !== name || bookmark.url !== url
  );
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

// New: Update bookmark in storage and UI
function updateBookmark(
  { li, name: oldName, url: oldUrl },
  newName,
  newUrl,
  newCategory
) {
  li.querySelector("a").textContent = `${newName} (${newCategory})`;
  li.querySelector("a").href = newUrl;
  li.dataset.category = newCategory;
  let bookmarks = getBookmarksFromStorage();
  bookmarks = bookmarks.map((bookmark) =>
    bookmark.name === oldName && bookmark.url === oldUrl
      ? { name: newName, url: newUrl, category: newCategory }
      : bookmark
  );
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
