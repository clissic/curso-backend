// GET USER BY ID:
const userIdBtn = document.getElementById("userIdBtn");
userIdBtn.addEventListener("click", () => {
    const userIdInputValue = document.getElementById("userIdInput").value;
    userIdBtn.href = `/api/users/${userIdInputValue}`
});

// GET PRODUCT BY ID:
const prodIdBtn = document.getElementById("prodIdBtn");
prodIdBtn.addEventListener("click", () => {
    const prodIdInputValue = document.getElementById("prodIdInput").value;
    prodIdBtn.href = `/api/products/${prodIdInputValue}`
});

// GET CART BY ID:
const cartIdBtn = document.getElementById("cartIdBtn");
cartIdBtn.addEventListener("click", () => {
    const cartIdInputValue = document.getElementById("cartIdInput").value;
    cartIdBtn.href = `/api/carts/${cartIdInputValue}`
});

// TOGGLE ROLE TO PREMIUM / USER:
const userEmailBtn = document.getElementById("userEmailBtn");
userEmailBtn.addEventListener("click", () => {
    const userEmailBtnValue = document.getElementById("userEmailInput").value;
    userEmailBtn.href = `/api/users/toggle-role/${userEmailBtnValue}`
});

// MODIFY STOCK:
const prodStockBtn = document.getElementById("prodStockBtn")
prodStockBtn.addEventListener("click", () => {
    const prodUpdateIdValue = document.getElementById("prodIdForStock").value
    const prodUpdateStockValue = document.getElementById("prodNewStock").value
    prodStockBtn.href = `/api/products/update-stock/${prodUpdateIdValue}/${prodUpdateStockValue}`
})

// MODIFY PRICE:
const prodPriceBtn = document.getElementById("prodPriceBtn")
prodPriceBtn.addEventListener("click", () => {
    const prodUpdateIdValue = document.getElementById("prodIdForPrice").value
    const prodUpdatePriceValue = document.getElementById("prodNewPrice").value
    prodPriceBtn.href = `/api/products/update-price/${prodUpdateIdValue}/${prodUpdatePriceValue}`
})