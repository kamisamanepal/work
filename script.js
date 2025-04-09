// Element references
const itemNameInput = document.getElementById("itemName");
const itemPriceInput = document.getElementById("itemPrice");
const addItemButton = document.getElementById("addItemButton");
const itemList = document.getElementById("itemList");
const itemCount = document.getElementById("itemCount");
const totalPrice = document.getElementById("totalPrice");
const searchInput = document.getElementById("searchInput");
const sortOption = document.getElementById("sortOption");
const darkModeButton = document.getElementById("darkModeButton");

let items = JSON.parse(localStorage.getItem('items')) || [];  // Load items from localStorage or initialize as empty array
let deletedItems = JSON.parse(localStorage.getItem('deletedItems')) || [];  // Load deleted items from localStorage or empty array
let editIndex = null;

// Update Display
function updateDisplay() {
  itemList.innerHTML = "";  // Clear current items

  let filtered = [...items]; // Make a copy of items

  // Search filtering
  const searchQuery = searchInput.value.toLowerCase(); // Get the search query and convert it to lowercase
  if (searchQuery) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery));  // Filter based on item name
  }

  // Sorting based on the selected option
  if (sortOption.value === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption.value === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  // Render the filtered and sorted items
  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        <span class="item-price">₹${item.price}</span>
      </div>
      <div class="item-buttons">
        <button onclick="editItem(${index})">Edit</button>
        <button onclick="confirmDelete(${index})">Delete</button>
      </div>`;
    itemList.appendChild(li);
  });

  // Update item count and total price
  itemCount.textContent = items.length;
  totalPrice.textContent = items.reduce((sum, item) => sum + item.price, 0);

  // Save items and deleted items to localStorage
  localStorage.setItem('items', JSON.stringify(items));
  localStorage.setItem('deletedItems', JSON.stringify(deletedItems));  // Save deleted items
}

addItemButton.addEventListener("click", () => {
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);
  if (name && !isNaN(price)) {
    items.push({ name, price });
    itemNameInput.value = "";
    itemPriceInput.value = "";
    updateDisplay();  // Update display after adding item
  }
});

// Search and sort event listeners
searchInput.addEventListener("input", updateDisplay);
sortOption.addEventListener("change", updateDisplay);

// Dark mode toggle
darkModeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Edit functionality
const editBox = document.getElementById("editBox");
const editName = document.getElementById("editItemName");
const editPrice = document.getElementById("editItemPrice");
const adjustInput = document.getElementById("priceAdjustmentInput");

document.getElementById("addPrice").onclick = () => {
  const value = parseFloat(adjustInput.value);
  if (!isNaN(value)) editPrice.value = parseFloat(editPrice.value) + value;
};
document.getElementById("subtractPrice").onclick = () => {
  const value = parseFloat(adjustInput.value);
  if (!isNaN(value)) editPrice.value = parseFloat(editPrice.value) - value;
};
document.getElementById("saveItemButton").onclick = () => {
  items[editIndex] = {
    name: editName.value.trim(),
    price: parseFloat(editPrice.value)
  };
  editBox.style.display = "none";
  updateDisplay();  // Update display after saving the item
};
document.getElementById("cancelEditButton").onclick = () => {
  editBox.style.display = "none";
};

function editItem(index) {
  editIndex = index;
  editName.value = items[index].name;
  editPrice.value = items[index].price;
  adjustInput.value = "";
  editBox.style.display = "block";
}

// Delete confirmation
const confirmBox = document.getElementById("confirmBox");
let deleteIndex = null;

function confirmDelete(index) {
  deleteIndex = index;
  confirmBox.style.display = "block";
}

document.getElementById("confirmDeleteButton").onclick = () => {
  deletedItems.unshift(items[deleteIndex]); // Add to start of the deleted items list
  if (deletedItems.length > 5) {
    deletedItems.pop(); // Keep only the last 5 deleted items
  }
  items.splice(deleteIndex, 1);  // Remove item from the main list
  confirmBox.style.display = "none";
  updateDisplay();  // Update display after deleting the item
  updateDeletedList();
};

document.getElementById("cancelDeleteButton").onclick = () => {
  confirmBox.style.display = "none";
};

// Recently Deleted Modal
const showDeletedBtn = document.getElementById("showDeletedBtn");
const deletedModal = document.getElementById("deletedModal");
const closeDeletedBtn = document.getElementById("closeDeletedBtn");

// Show the Recently Deleted modal
showDeletedBtn.addEventListener("click", () => {
  deletedModal.classList.add("show");
  deletedModal.style.display = "block";
  document.getElementById("deletedModalOverlay").classList.add("show");
});

// Close the Recently Deleted modal
closeDeletedBtn.addEventListener("click", () => {
  deletedModal.classList.remove("show");
  setTimeout(() => deletedModal.style.display = "none", 300);
  document.getElementById("deletedModalOverlay").classList.remove("show");
});

// Update the Recently Deleted List with a View More Button
function updateDeletedList(limit = 3) {
  const list = document.getElementById("deletedList");
  list.innerHTML = "";  // Clear previous list

  const itemsToShow = deletedItems.slice(0, limit);
  itemsToShow.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} - ₹${item.price}</span>
      <button onclick="restoreItem(${index})">Restore</button>
    `;
    list.appendChild(li);
  });

  if (deletedItems.length > limit) {
    const viewMore = document.createElement("button");
    viewMore.textContent = "View More";
    viewMore.onclick = () => updateDeletedList(deletedItems.length);
    list.appendChild(viewMore);
  }
}

// Restore functionality
function restoreItem(index) {
  items.push(deletedItems[index]);
  deletedItems.splice(index, 1); // Remove the item from the deleted list
  updateDisplay();  // Update display after restoring the item
  updateDeletedList();
}

// Initialize display when page loads
updateDisplay();
 
