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

let items = [];
let deletedItems = [];
let editIndex = null;

function updateDisplay() {
  itemList.innerHTML = "";
  let filtered = [...items];

  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(search));
  }

  if (sortOption.value === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption.value === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

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

  itemCount.textContent = items.length;
  totalPrice.textContent = items.reduce((sum, item) => sum + item.price, 0);
}

addItemButton.addEventListener("click", () => {
  const name = itemNameInput.value.trim();
  const price = parseFloat(itemPriceInput.value);
  if (name && !isNaN(price)) {
    items.push({ name, price });
    itemNameInput.value = "";
    itemPriceInput.value = "";
    updateDisplay();
  }
});

searchInput.addEventListener("input", updateDisplay);
sortOption.addEventListener("change", updateDisplay);
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
  updateDisplay();
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
  deletedItems.unshift(items[deleteIndex]);
  items.splice(deleteIndex, 1);
  confirmBox.style.display = "none";
  updateDisplay();
  updateDeletedList();
};
document.getElementById("cancelDeleteButton").onclick = () => {
  confirmBox.style.display = "none";
};

// Recently Deleted Modal
const showDeletedBtn = document.getElementById("showDeletedBtn");
const deletedModal = document.getElementById("deletedModal");
const closeDeletedBtn = document.getElementById("closeDeletedBtn");

showDeletedBtn.addEventListener("click", () => {
  deletedModal.style.display = "block";
});
closeDeletedBtn.addEventListener("click", () => {
  deletedModal.style.display = "none";
});

function updateDeletedList() {
  const list = document.getElementById("deletedList");
  list.innerHTML = "";
  deletedItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ₹${item.price}`;
    list.appendChild(li);
  });
}
