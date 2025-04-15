// function fetchData() {
//   fetch("/public/data.json")
//     .then((response) => response.json())
//     .then((data) => {
//       //   console.log(data, 22);
//       //   const {image, name, category, price} = data[0]

//       data.forEach((product) => {
//         const productCard = document.querySelector(".row");
//         productCard.innerHTML += `
//          <div class="col-md-4 p-2 bg-white rounded">
//         <div class="card" style="width: 18rem;">
//             <img src="${product.image.desktop}" class="card-img-top" alt="${product.name}">
//             <div class="card-body">
//                 <h5 class="card-title">${product.category}</h5>
//                 <p class="card-text">${product.name}</p>
//                 <p  class="text-danger">₦ ${product.price}</p>
//             </div>
//             </div>
//             </div>
//             `;
            
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching product:", error);
//     });
// }
// fetchData();

