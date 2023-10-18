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
const userEmail = document.getElementById("userEmail").value;

confirmCart.addEventListener("click", () => {
  fetch(`/api/carts/${cid}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: userEmail }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.noStock) {
        Swal.fire({
          icon: "success",
          title: "Thank you for buying in iCommerce!",
          text: `
                  Hello ${data.payload.purchaser}! Your purchase with code: ${
            data.payload.code
          }, for a total of: U$D ${data.payload.amount}, was successfully made.
                  The following products have no stock and will stay in your cart:
                    ${data.noStock
                      .map((product) => `${product.product.title}`)
                      .join(", ")}
                `,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setTimeout(() => {
          location.reload();
        }, "10000");
      } else if (data.message) {
        Swal.fire({
          icon: "error",
          title: "We are sorry...",
          text: `
                    Your purchase could not be realized.
                    ${data.message}.
                    `,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setTimeout(() => {
          location.reload();
        }, "10000");
      }
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});

emptyCart.addEventListener("click", () => {
  fetch(`/api/carts/${cid}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setTimeout(() => {
        location.reload();
      }, 1000);
      return response.json();
    })
    .then((data) => {
      console.log("Cart deleted:", data);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});
