// Variables
const itemList = document.getElementById("itemList");
const addItemButton = document.getElementById("addItemButton");
const itemNameInput = document.getElementById("itemName");
const itemPriceInput = document.getElementById("itemPrice");
const searchInput = document.getElementById("searchInput");
const sortOption = document.getElementById("sortOption");
const itemCount = document.getElementById("itemCount");
const totalPrice = document.getElementById("totalPrice");
const darkModeButton = document.getElementById("darkModeButton");
const confirmBox = document.getElementById("confirmBox");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const clearAllBox = document.getElementById("clearAllBox");
const confirmClearAllButton = document.getElementById("confirmClearAllButton");
const cancelClearAllButton = document.getElementById("cancelClearAllButton");

// Array to hold items
let items = JSON.parse(localStorage.getItem('items')) || [];

// Add Item Function
function addItem() {
    const name = itemNameInput.value.trim();
    const price = parseFloat(itemPriceInput.value.trim());

    if (!name || isNaN(price) || price <= 0) {
        alert("Please enter a valid item name and price.");
        return;
    }

    const newItem = { name, price };
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    displayItems();
    itemNameInput.value = "";
    itemPriceInput.value = "";
}

// Display Items Function
function displayItems() {
    itemList.innerHTML = "";

    const searchQuery = searchInput.value.toLowerCase();
    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery));

    const sortMethod = sortOption.value;
    if (sortMethod === "price-asc") {
        filteredItems.sort((a, b) => a.price - b.price);
    } else if (sortMethod === "price-desc") {
        filteredItems.sort((a, b) => b.price - a.price);
    } else {
        filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    filteredItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">₹${item.price}</span>
            </div>
            <div class="item-buttons">
                <button onclick="deleteItem(${index})">Delete</button>
            </div>
        `;
        itemList.appendChild(li);
    });

    itemCount.textContent = filteredItems.length;
    totalPrice.textContent = filteredItems.reduce((total, item) => total + item.price, 0).toFixed(2);
}

// Delete Item Function (Updated for Confirmation)
let itemToDeleteIndex = null;

function deleteItem(index) {
    itemToDeleteIndex = index;
    confirmBox.style.display = "block"; // Show the confirmation box
}

// Confirm Delete Function
function confirmDelete() {
    if (itemToDeleteIndex !== null) {
        items.splice(itemToDeleteIndex, 1); // Remove item from array
        localStorage.setItem('items', JSON.stringify(items)); // Update local storage
        displayItems(); // Re-display items
        confirmBox.style.display = "none"; // Hide the confirmation box
    }
}

// Cancel Delete Function
function cancelDelete() {
    confirmBox.style.display = "none"; // Hide the confirmation box without deleting
}

// Event Listeners for confirmation buttons
confirmDeleteButton.addEventListener("click", confirmDelete);
cancelDeleteButton.addEventListener("click", cancelDelete);

// Toggle Dark Mode
darkModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

// Event Listeners for other actions
addItemButton.addEventListener("click", addItem);
searchInput.addEventListener("input", displayItems);
sortOption.addEventListener("change", displayItems);

// Initial Display
displayItems();
