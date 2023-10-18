const socket = io();

const getDeleteBtns = document.getElementsByClassName("deleteButton");
const getAddProductSubmitBtn = document.getElementById("addProductSubmitBtn");

// ELIMINAR UN PRODUCTO CON WEBSOCKETS
for (let i = 0; i < getDeleteBtns.length; i++) {
  getDeleteBtns[i].addEventListener("click", function () {
    let id = this.getAttribute("data-id");
    socket.emit("productIdToBeRemoved", id);
    console.log("Product with id: " + id + " was deleted succesfully, please refresh (F5)")
});
}

// Escuchar evento 'productDeleted' del servidor
socket.on("productDeleted", async (deletedAndUpdatedProducts, productDeleted) => {
  console.log("Product deleted:", productDeleted);
  document.getElementById("realTimeProds").innerHTML = deletedAndUpdatedProducts.map((prod) => {
    return `
    <div class="realTimeProd">
      <div class="realTimeProdParams">
        <p class="realTimeProdProps">Id: ${prod._id}</p>
        <p class="realTimeProdProps">Thumbnail: <a target="_blank" href="${prod.thumbnail}">Product img</a></p>
        <p class="realTimeProdProps">Name: ${prod.title}</p>
        <p class="realTimeProdProps">Price: ${prod.price}</p>
        <p class="realTimeProdProps">Description: ${prod.description}</p>
        <p class="realTimeProdProps">Code: ${prod.code}</p>
        <p class="realTimeProdProps">Category: ${prod.category}</p>
        <p class="realTimeProdProps">Stock: ${prod.stock}</p>
        <p class="realTimeProdProps">Status: ${prod.status}</p>
        <p class="realTimeProdProps">Owner: ${prod.owner}</p>
      </div>
      <button id="realTimeDeleteButton" data-id="${prod._id}" class="deleteButton">Delete</button>
    </div>
    `
  }).join("")
});

// Escuchar evento 'productDeletionError' del servidor
socket.on("productDeletionError", (errorMessage) => {
  Swal.fire({title: "Error deleting product:", text: errorMessage})
  console.log("Error deleting product:", errorMessage);
});

// AGREGAR UN PRODUCTO CON WEBSOCKETS
getAddProductSubmitBtn.addEventListener("click", () => {

  let thumbnail = document.getElementById("thumbnail").value;
  let title = document.getElementById("title").value;
  let price = document.getElementById("price").value;
  let description = document.getElementById("description").value;
  let code = document.getElementById("code").value;
  let category = document.getElementById("category").value;
  let stock = document.getElementById("stock").value;
  let owner = document.getElementById("owner").value

  let newProduct = {
    thumbnail,
    title,
    price,
    description,
    code,
    category,
    stock,
    status: true,
    owner,
  };

  fetch(`/api/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct)
  })
    .then((response) => response.json())
    .then(data => data)
    .catch(error => console.log("Error: " + error))
});