// === Entry Point ===
document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  fetchProducts();
  setupOrderConfirmation();
}

// === Fetch and Render Products ===
function fetchProducts() {
  fetch("/public/data.json")
    .then((response) => response.json())
    .then((data) => renderProducts(data))
    .catch((error) => console.error("Error fetching data.json:", error));
}

function renderProducts(products) {
  const productCard = document.querySelector(".row");
  productCard.innerHTML = "";
  products.forEach(
    (product) => (productCard.innerHTML += createProductCard(product))
  );
  setupProductEvents();
}

function createProductCard(product) {
  return `
    <div class="col-md-4 p-5 bg-white rounded">
      <div class="card" style="width: 18rem;" data-product-name="${
        product.name
      }">
        <img src="${product.image.desktop}" class="card-img-top" alt="${
    product.name
  }">
        <div class="card-body">
          <a href="#" class="btn btn-primary add-to-cart">
            <img src="/assets/images/icon-add-to-cart.svg" alt=""> Add to Cart
          </a>
          <div class="hoverbtn" style="display: none;">
            <img src="/assets/images/icon-decrement-quantity.svg" class="img1" alt="">
            <span class="count">1</span>
            <img src="/assets/images/icon-increment-quantity.svg" class="img2" alt="">
          </div>
          <p class="card-title">${product.category}</p>
          <h5 class="card-text">${product.name}</h5>
          <p class="text-danger">₦ ${product.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;
}

// === Product Event Handling ===
function setupProductEvents() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    const addBtn = card.querySelector(".add-to-cart");
    const hoverBtn = card.querySelector(".hoverbtn");
    const incrementBtn = card.querySelector(".img2");
    const decrementBtn = card.querySelector(".img1");
    const countDisplay = card.querySelector(".count");
    const productName = card.dataset.productName;
    const priceText = card.querySelector(".text-danger").textContent;

    let count = 1;
    const price = getCleanPrice(priceText);

    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      count = 1;
      toggleCartButtons(addBtn, hoverBtn, true);
      countDisplay.textContent = count;
      updateCartItem(productName, count, price);
      updateTotal();
    });

    incrementBtn.addEventListener("click", () => {
      count++;
      countDisplay.textContent = count;
      decrementBtn.disabled = count <= 1; 
       // his is a built-in DOM property. When true, the button is disabled (unclickable and greyed out). When false, it’s enabled
      updateCartItem(productName, count, price);
      updateTotal();
    });

    decrementBtn.addEventListener("click", () => {
      if (count > 1) {
        count--;
        countDisplay.textContent = count;
        decrementBtn.disabled = count <= 1;
        updateCartItem(productName, count, price);
      } else {
        resetProductUI(addBtn, hoverBtn);
        handleRemoveCartItem(productName);
      }
      updateTotal();
    });
  });
}

// === Cart Management ===
function updateCartItem(name, count, price) {
  const cartlist = document.querySelector(".cartlist");
  const totalPrice = (price * count).toFixed(2);
  const existingItem = cartlist.querySelector(`[data-cart-item="${name}"]`);

  if (existingItem) {
    existingItem.querySelector(
      "p"
    ).textContent = `${count}x    @₦${price.toFixed(2)}  - ₦${totalPrice}`;
  } else {
    const productDiv = document.createElement("div");
    productDiv.setAttribute("data-cart-item", name);
    productDiv.innerHTML = `
      <h3>${name}</h3>
      <p>${count}x    - @₦${totalPrice}</p>
      <button class="remove-btn" style="background:none;border:none;color:red;cursor:pointer;">×</button>
    `;
    productDiv.querySelector(".remove-btn").addEventListener("click", () => {
      handleRemoveCartItem(name);
    });
    cartlist.appendChild(productDiv);
  }
  updateCartCountDisplay()
  document.querySelector(".emptycake").style.display = "none";
  document.querySelector(".cake").style.display = "none";
  document.querySelector(".cart-footer").style.display = "block";
}

function getCartItemCount() {
  return document.querySelectorAll(".cartlist [data-cart-item]").length;
}

function updateCartCountDisplay() {
  const countCart = getCartItemCount();
  document.querySelector(".cartcount").textContent = `(${countCart})`;
}


function handleRemoveCartItem(name) {
  // Remove from cart
  const item = document.querySelector(`[data-cart-item="${name}"]`);
  if (item) item.remove();

  // Reset the product UI
  const card = document.querySelector(`.card[data-product-name="${name}"]`);
  if (card) {
    const addBtn = card.querySelector(".add-to-cart");
    const hoverBtn = card.querySelector(".hoverbtn");
    const countDisplay = card.querySelector(".count");
    countDisplay.textContent = "1";
    toggleCartButtons(addBtn, hoverBtn, false);
  }

  // Update total and check cart status
  updateTotal();
  updateCartCountDisplay()
  checkEmptyCart();
}

function updateTotal() {
  const cartItems = document.querySelectorAll(".cartlist [data-cart-item]");
  let total = 0;

  cartItems.forEach((item) => {
    const priceLine = item.querySelector("p").textContent;
    const match = priceLine.match(/₦(\d+(\.\d{2})?)$/);
    if (match) total += parseFloat(match[1]);
  });

  document.getElementById("order-total").textContent = total.toFixed(2);
}

function checkEmptyCart() {
  const cartlist = document.querySelector(".cartlist");
  const isEmpty = cartlist.children.length === 0;
  document.querySelector(".emptycake").style.display = isEmpty
    ? "block"
    : "none";
  document.querySelector(".cake").style.display = isEmpty ? "block" : "none";
  document.querySelector(".cart-footer").style.display = isEmpty
    ? "none"
    : "block";
}

// === Utility Functions ===
function getCleanPrice(priceStr) {
  return Number(priceStr.replace(/[^0-9.]/g, ""));
}

function toggleCartButtons(addBtn, hoverBtn, isCartVisible) {
  addBtn.style.display = isCartVisible ? "none" : "block";
  hoverBtn.style.display = isCartVisible ? "inline-flex" : "none";
}

function resetProductUI(addBtn, hoverBtn) {
  toggleCartButtons(addBtn, hoverBtn, false);
}

document.getElementById("confirm-order").addEventListener("click", () => {
  document.getElementById("confirmation-modal").style.display = "flex";
  document.getElementById("modal-total").textContent = document.getElementById("order-total").textContent;
 
});

document.getElementById("confirm-yes").addEventListener("click", () => {
  alert("Order confirmed! 🎉");
  document.getElementById("confirmation-modal").style.display = "none";
  document.querySelector(".cartlist").innerHTML = "";
  document.getElementById("order-total").textContent = "0.00";
  document.querySelector(".emptycake").style.display = "block";
  document.querySelector(".cake").style.display = "block";
});

document.getElementById("confirm-no").addEventListener("click", () => {
  document.getElementById("confirmation-modal").style.display = "none";
  updateTotal();
  checkEmptyCart();
});







