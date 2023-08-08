const socket = io();

const getDeleteBtnsCart = document.getElementsByClassName("deleteButtonCart");
const cid = document.getElementById("cartTitle").getAttribute("data-id");

// ELIMINAR UN PRODUCTO DEL CARRITO CON WEBSOCKETS
for (let i = 0; i < getDeleteBtnsCart.length; i++) {
  getDeleteBtnsCart[i].addEventListener("click", function () {
    let pid = this.getAttribute("data-id");
    socket.emit("productIdToBeRemovedFromCart", pid, cid);
    console.log(
      "Product with id: " +
        pid +
        " was deleted succesfully from cart, please refresh (F5)"
    );
    location.reload();
  });
}

// Escuchar evento 'productDeleted' del servidor
socket.on(
  "productDeletedFromCart",
  async (deletedAndUpdatedProducts, productDeleted) => {
    document.getElementById("realTimeCartProds").innerHTML =
      deletedAndUpdatedProducts
        .map((prod) => {
          return `
        <div class="cartProdImgContainer">
          <img
            class="cartProdImg"
            src=${prod.thumbnail}
            alt="${prod.title}"
          />
        </div>
        <div class="cartProdDataCard">
          <p>Product:</p>
          <h2>${prod.title}</h2>
        </div>
        <div class="cartProdDataCard">
          <p>Quantity:</p>
          <h2>${prod.quantity}</h2>
        </div>
        <div class="cartProdDataCard">
          <p>Description:</p>
          <h2>${prod.description}</h2>
        </div>
        <div class="cartProdDataCard">
          <p>Unit price:</p>
          <h2>U$S ${prod.price}</h2>
        </div>
        <button class="deleteButtonCart" data-id=${prod._id}><img class="deleteImg" src="https://cdn-icons-png.flaticon.com/512/1017/1017530.png" alt="delete"></button>
      `;
        })
        .join("");
  }
);

const confirmCart = document.getElementById("confirmCart");
const emptyCart = document.getElementById("emptyCart");

confirmCart.addEventListener("click", () => {
  fetch(`http://127.0.0.1:8080/api/carts/${cid}/purchase`, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      document.write(
        `Hola ${data.payload.purchaser}. Tu compra ${data.payload.code}, valor: U$D${data.payload.amount}, fue realizada con exito. Los siguientes productos no tenian stock y permanecen en tu carrito:`
      );
      document.write(`${JSON.stringify(data.noStock)}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

emptyCart.addEventListener("click", () => {
  fetch(`http://127.0.0.1:8080/api/carts/${cid}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setTimeout(() => {
          location.reload()
      }, 1000)
      return response.json();
    })
    .then((data) => {
      console.log("Cart deleted:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
