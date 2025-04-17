// Start the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  startMyApp();
});

// Main function to kick things off
function startMyApp() {
  loadDesserts();
  setupCheckout();
}

// Load desserts from data.json
function loadDesserts() {
  fetch("/public/data.json")
      .then((res) => res.json())
      .then((desserts) => showDesserts(desserts))
      .catch((err) => console.log("Oops, couldn't load desserts:", err));
}

// Display desserts on the page
function showDesserts(desserts) {
  const dessertGrid = document.querySelector(".my-products");
  dessertGrid.innerHTML = "";
  desserts.forEach((dessert) => {
      dessertGrid.innerHTML += makeDessertCard(dessert);
  });
  addDessertButtons();
}

// Create HTML for a single dessert card
function makeDessertCard(dessert) {
  return `
      <div class="col">
          <div class="card h-100 border-0 shadow-sm" data-dessert="${dessert.name}">
              <img src="${dessert.image.desktop}" class="card-img-top rounded" alt="${dessert.name}">
              <div class="card-body">
                  <button class="btn btn-dark border add-dessert w-75 mb-3">
                      <img src="/assets/images/icon-add-to-cart.svg" alt="Add" class="me-2">
                      Add to Cart
                  </button>
                  <div class="quantity-box d-none w-75 mb-3">
                      <div class="btn-group w-100">
                          <button class="btn btn-dark reduce-btn">
                              <img src="/assets/images/icon-decrement-quantity.svg" alt="Reduce">
                          </button>
                          <span class="qty btn btn-light border-0">1</span>
                          <button class="btn btn-primary add-btn">
                              <img src="/assets/images/icon-increment-quantity.svg" alt="Add">
                          </button>
                      </div>
                  </div>
                  <p class="text-muted mb-1">${dessert.category}</p>
                  <h5 class="fw-bold">${dessert.name}</h5>
                  <p class="text-danger fw-bold">₦${dessert.price.toFixed(2)}</p>
              </div>
          </div>
      </div>
  `;
}

// Set up buttons for adding/removing desserts
function addDessertButtons() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
      const addBtn = card.querySelector(".add-dessert");
      const qtyBox = card.querySelector(".quantity-box");
      const addMore = card.querySelector(".add-btn");
      const reduce = card.querySelector(".reduce-btn");
      const qtyText = card.querySelector(".qty");
      const dessertName = card.dataset.dessert;
      const price = parseFloat(card.querySelector(".text-danger").textContent.replace("₦", ""));

      let qty = 1;

      addBtn.addEventListener("click", () => {
          qty = 1;
          qtyText.textContent = qty;
          showQtyBox(addBtn, qtyBox);
          updateMyCart(dessertName, qty, price);
          refreshTotal();
          updateCartCount();
      });

      addMore.addEventListener("click", () => {
          qty++;
          qtyText.textContent = qty;
          updateMyCart(dessertName, qty, price);
          refreshTotal();
          updateCartCount();
      });

      reduce.addEventListener("click", () => {
          if (qty > 1) {
              qty--;
              qtyText.textContent = qty;
              updateMyCart(dessertName, qty, price);
          } else {
              clearDessert(addBtn, qtyBox, qtyText);
              removeFromCart(dessertName);
          }
          refreshTotal();
          updateCartCount();
      });
  });
}

// Update the cart with a dessert
function updateMyCart(name, qty, price) {
  const cartItems = document.querySelector(".cart-content");
  const total = (qty * price).toFixed(2);
  const item = cartItems.querySelector(`[data-item="${name}"]`);

  if (item) {
      item.querySelector(".item-info").innerHTML = `
          <span class="text-primary fw-bold">${qty}x</span>
          <span class="text-muted ms-2">@ ₦${price.toFixed(2)}</span>
          <span class="text-dark fw-bold ms-2">₦${total}</span>
      `;
  } else {
      const newItem = document.createElement("div");
      newItem.classList.add("d-flex", "justify-content-between", "align-items-center", "mb-2");
      newItem.setAttribute("data-item", name);
      newItem.innerHTML = `
          <div>
              <h6 class="fw-bold mb-1">${name}</h6>
              <div class="item-info">
                  <span class="text-primary fw-bold">${qty}x</span>
                  <span class="text-muted ms-2">@ ₦${price.toFixed(2)}</span>
                  <span class="text-dark fw-bold ms-2">₦${total}</span>
              </div>
          </div>
          <button class="btn btn-link text-danger p-0 delete-item">
              <img src="/assets/images/icon-remove-item.svg" alt="Delete">
          </button>
      `;
      newItem.querySelector(".delete-item").addEventListener("click", () => {
          removeFromCart(name);
          refreshTotal();
          updateCartCount();
      });
      cartItems.appendChild(newItem);
  }

  document.querySelector(".empty-cart-img").style.display = "none";
  document.querySelector(".empty-cart-text").style.display = "none";
  document.querySelector(".cart-summary").style.display = "block";
}

// Remove a dessert from the cart
function removeFromCart(name) {
  const item = document.querySelector(`[data-item="${name}"]`);
  if (item) item.remove();

  const card = document.querySelector(`.card[data-dessert="${name}"]`);
  if (card) {
      const addBtn = card.querySelector(".add-dessert");
      const qtyBox = card.querySelector(".quantity-box");
      const qtyText = card.querySelector(".qty");
      clearDessert(addBtn, qtyBox, qtyText);
  }

  checkIfCartEmpty();
}

// Update the total price
function refreshTotal() {
  const items = document.querySelectorAll(".cart-content [data-item]");
  let total = 0;
  items.forEach((item) => {
      const price = parseFloat(item.querySelector(".item-info .text-dark").textContent.replace("₦", ""));
      total += price;
  });
  document.getElementById("total-price").textContent = total.toFixed(2);
}

// Check if the cart is empty
function checkIfCartEmpty() {
  const items = document.querySelectorAll(".cart-content [data-item]").length;
  if (items === 0) {
      document.querySelector(".empty-cart-img").style.display = "block";
      document.querySelector(".empty-cart-text").style.display = "block";
      document.querySelector(".cart-summary").style.display = "none";
  }
}

// Update the cart item count
function updateCartCount() {
  const itemCount = document.querySelectorAll(".cart-content [data-item]").length;
  document.querySelector(".cart-items-count").textContent = `(${itemCount})`;
}

// Show/hide add button and quantity box
function showQtyBox(addBtn, qtyBox) {
  addBtn.classList.add("d-none");
  qtyBox.classList.remove("d-none");
}

// Reset dessert card UI
function clearDessert(addBtn, qtyBox, qtyText) {
  qtyText.textContent = "1";
  addBtn.classList.remove("d-none");
  qtyBox.classList.add("d-none");
}

// Set up checkout modal
function setupCheckout() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const submitBtn = document.getElementById("submit-order");
  const newOrderBtn = document.getElementById("new-order");
  const modal = new bootstrap.Modal(document.getElementById("order-modal"));

  checkoutBtn.addEventListener("click", () => {
      document.getElementById("order-items").innerHTML = document.querySelector(".cart-content").innerHTML;
      document.getElementById("order-total").textContent = document.getElementById("total-price").textContent;
      modal.show();
  });

  submitBtn.addEventListener("click", () => {
      document.getElementById("order-success").style.display = "block";
      document.getElementById("submit-order").style.display = "none";
      document.getElementById("cancel-btn").style.display = "none";
      document.getElementById("new-order").style.display = "inline-block";
  });

  newOrderBtn.addEventListener("click", () => {
      document.querySelector(".cart-content").innerHTML = "";
      document.querySelectorAll(".card").forEach((card) => {
          const addBtn = card.querySelector(".add-dessert");
          const qtyBox = card.querySelector(".quantity-box");
          const qtyText = card.querySelector(".qty");
          clearDessert(addBtn, qtyBox, qtyText);
      });
      refreshTotal();
      updateCartCount();
      checkIfCartEmpty();
      modal.hide();
  });
}