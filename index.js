

function fetchAdvice() {
  fetch("/public/data.json")
    .then((response) => response.json())
    .then((data) => {
      const productCard = document.querySelector(".row");
      const cartlist = document.querySelector(".cartlist");
      productCard.innerHTML = "";

      data.forEach((product) => {
        const cardHTML = `
          <div class="col-md-4 p-5 bg-white rounded">
            <div class="card" style="width: 18rem;" data-product-name="${product.name}">
              <img src="${product.image.desktop}" class="card-img-top" alt="${product.name}">
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
        productCard.innerHTML += cardHTML;
      });

      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const addBtn = card.querySelector(".add-to-cart");
        const hoverBtn = card.querySelector(".hoverbtn");
        const incrementBtn = card.querySelector(".img2");
        const decrementBtn = card.querySelector(".img1");
        const countDisplay = card.querySelector(".count");
        const productName = card.dataset.productName;
        const priceText = card.querySelector(".text-danger").textContent; 
        

        function getCleanPrice(priceStr) {
          return Number(priceStr.replace(/[^0-9.]/g, ""));
        }

        let count = 1;

        function updateCartItem(name, count, price) {
  const formattedPrice = Number(price).toFixed(2);
  const totalPrice = (formattedPrice * count).toFixed(2)
  const removebtn = document.createElement("div")
  const existingItem = cartlist.querySelector(`[data-cart-item="${name}"]`);


  if (existingItem) {
    existingItem.querySelector("p").textContent = `${count}x    @₦${formattedPrice}  - ₦${totalPrice} `;
  } else {
    const productDiv = document.createElement("div");
    productDiv.setAttribute("data-cart-item", name);
    productDiv.innerHTML = ` <h3>${name}  </h3>
              <p>${count}x @₦${formattedPrice} - ₦${totalPrice}</p>
              <button class="remove-btn" style="background:none; border:none; color:red; font-size:1.2rem; cursor:pointer;">×</button>
    `;
   
    productDiv.querySelector(".remove-btn").addEventListener("click", () => {
      productDiv.remove();
      updateTotal();
    });
    cartlist.appendChild(productDiv);

  }
  updateTotal();
    
}


        addBtn.addEventListener("click", (e) => {
          e.preventDefault();
          addBtn.style.display = "none";
          hoverBtn.style.display = "inline-flex";
          countDisplay.textContent = "1";
          updateCartItem(productName, 1);
          let cake = document.querySelector(".emptycake");
          cake.style.display = "none";
          let text = document.querySelector(".cake");
          text.style.display = "none";
          updateCartItem(productName, count, getCleanPrice(priceText));
          let  cartFooter = document.querySelector(".cart-footer")
          cartFooter.style.display = "block"
        });

        incrementBtn.addEventListener("click", () => {
          let currentCount = parseInt(countDisplay.textContent);
          currentCount++;
          countDisplay.textContent = currentCount;
          decrementBtn.disabled = currentCount <= 1;
          updateCartItem(productName, currentCount,  getCleanPrice(priceText));
        });

        decrementBtn.addEventListener("click", () => {
          let currentCount = parseInt(countDisplay.textContent);

          if (currentCount > 1) {
            currentCount--;
            countDisplay.textContent = currentCount;
            decrementBtn.disabled = currentCount <= 1;
            updateCartItem(productName, currentCount,  getCleanPrice(priceText));
          } else {
            countDisplay.textContent = "1";
            hoverBtn.style.display = "none";
            addBtn.style.display = "block";
            let cake = document.querySelector(".emptycake");
            cake.style.display = "block";
            let text = document.querySelector(".cake");
            text.style.display = "block";
            let  cartFooter = document.querySelector(".cart-footer")
          cartFooter.style.display = "none"
            removeCartItem(productName, currentCount,  getCleanPrice(priceText));
          }
          
        });
        
        
      });
      function removeCartItem(name) {
        const existingItem = document.querySelector(`[data-cart-item="${name}"]`);
        if (existingItem) {
          existingItem.remove();
        }
      
        // Optionally: Check if cart is completely empty, and show empty cart message
        const cartlist = document.querySelector(".cartlist");
        if (cartlist.children.length === 0) {
          document.querySelector(".emptycake").style.display = "block";
          document.querySelector(".cake").style.display = "block";
        }
      }

      
      function updateTotal() {
        let total = 0;
        const cartItems = document.querySelectorAll(".cartlist [data-cart-item]");
      
        cartItems.forEach((item) => {
          const priceLine = item.querySelector("p").textContent;
          const match = priceLine.match(/₦(\d+(\.\d{2})?)$/); // matches the total price
          if (match) {
            total += parseFloat(match[1]);
          }
        });
      
        document.getElementById("order-total").textContent = total.toFixed(2);
      }
    })
    .catch((error) => {
      console.error("Error fetching data.json:", error);
    });
}

fetchAdvice();





document.getElementById("confirm-order").addEventListener("click", () => {
  document.getElementById("confirmation-modal").style.display = "flex";
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
});



