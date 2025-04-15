


// let count = 0;

// function fetchAdvice() {
//   fetch("/public/data.json") // This is the endpoint you're getting data from
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data, 22);

//       const productCard = document.querySelector(".row");

//       data.forEach((product) => {
//         const cardHTML = `
//           <div class="col-md-4 p-5 bg-white rounded">
//             <div class="card" style="width: 18rem;">
//               <img src="${product.image.desktop}" class="card-img-top" alt="${product.name}">
//               <div class="card-body">
//                 <a href="#" class="btn btn-primary add-to-cart">
//                   <img src="/assets/images/icon-add-to-cart.svg" alt=""> Add to Cart
//                 </a>
//                 <div class="hoverbtn" style="display: none;">
//                   <img src="/assets/images/icon-decrement-quantity.svg" class="img1" alt="">
//                   <span class="count"> 0 </span>
//                   <img src="/assets/images/icon-increment-quantity.svg" class="img2" alt="">
//                 </div>
//                 <p class="card-title">${product.category}</p>
//                 <h5 class="card-text">${product.name}</h5>
//                 <p class="text-danger">₦ ${product.price.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         `;

//         productCard.innerHTML += cardHTML;
//       });

//       const cards = document.querySelectorAll(".card");

//       cards.forEach((card) => {
//         const addBtn = card.querySelector(".add-to-cart");
//         const hoverBtn = card.querySelector(".hoverbtn");
//         const incrementBtn = card.querySelector(".img2");
//         const decrementBtn = card.querySelector(".img1");
//         const countDisplay = card.querySelector(".count");

//         addBtn.addEventListener("click", (e) => {
//           e.preventDefault();
//           addBtn.style.display = "none";
//           hoverBtn.style.display = "inline-block";
//         });

//         incrementBtn.addEventListener("click", () => {
//           let currentCount = parseInt(countDisplay.textContent);
//           currentCount++;
//           countDisplay.textContent = currentCount;
//           decrementBtn.disabled = currentCount <= 1;
//         });

//         decrementBtn.addEventListener("click", () => {
//           let currentCount = parseInt(countDisplay.textContent);
//           if (currentCount > 1) {
//             currentCount--;
//             countDisplay.textContent = currentCount;
//           }
//           decrementBtn.disabled = currentCount <= 1;
//         });
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching data.json:", error);
//     });
// }

// fetchAdvice();

// const confirmOrderBtn = document.getElementById("confirmOrderBtn");
// const modal = document.getElementById("orderModal");
// const closeModal = document.getElementById("closeModal");

// // Show modal on Confirm Order click
// confirmOrderBtn.addEventListener("click", () => {
//   modal.style.display = "flex"; // use flex so it's centered
// });

// // Hide modal on Close click
// closeModal.addEventListener("click", () => {
//   modal.style.display = "none";
// });

function fetchAdvice() {
  fetch("/public/data.json")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const productCard = document.querySelector(".row");
      productCard.innerHTML = ""; // Clear existing content if any

      data.forEach((product) => {
        
        let count = 1
        const cardHTML = `
          <div class="col-md-4 p-5 bg-white rounded">
            <div class="card" style="width: 18rem;">
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

      // Bind event listeners after DOM update
      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        const addBtn = card.querySelector(".add-to-cart");
        const hoverBtn = card.querySelector(".hoverbtn");
        const incrementBtn = card.querySelector(".img2");
        const decrementBtn = card.querySelector(".img1");
        const countDisplay = card.querySelector(".count");

        addBtn.addEventListener("click", (e) => {
          e.preventDefault();
          addBtn.style.display = "none";
          hoverBtn.style.display = "inline-flex";
        });

        incrementBtn.addEventListener("click", () => {
          let currentCount = parseInt(countDisplay.textContent);
          currentCount++;
          countDisplay.textContent = currentCount;
          decrementBtn.disabled = currentCount <= 1;
        });

        decrementBtn.addEventListener("click", () => {
          let currentCount = parseInt(countDisplay.textContent);
          if (currentCount === 1){
          addBtn.style.display = "block";
           hoverBtn.style.display = "none"

          }
          if (currentCount > 1) {
            currentCount--;
            countDisplay.textContent = currentCount;
          }
          decrementBtn.disabled = currentCount <= 1;
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data.json:", error);
    });
}

fetchAdvice();

// ====== Modal for Order Confirmation ======

// const confirmOrderBtn = document.getElementById("confirmOrderBtn");
// const modal = document.getElementById("orderModal");
// const closeModal = document.getElementById("closeModal");

// // Check if modal elements exist before attaching events
// if (confirmOrderBtn && modal && closeModal) {
//   confirmOrderBtn.addEventListener("click", () => {
//     modal.style.display = "flex";
//   });

//   closeModal.addEventListener("click", () => {
//     modal.style.display = "none";
//   });
// }
