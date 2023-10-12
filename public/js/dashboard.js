const userIdBtn = document.getElementById("userIdBtn");

userIdBtn.addEventListener("mouseover", () => {
    const userIdInputValue = document.getElementById("userIdInput").value;
    userIdBtn.href = `/api/users/${userIdInputValue}`
});

const prodIdBtn = document.getElementById("prodIdBtn");

prodIdBtn.addEventListener("mouseover", () => {
    const prodIdInputValue = document.getElementById("prodIdInput").value;
    prodIdBtn.href = `/api/products/${prodIdInputValue}`
});

const userEmailBtn = document.getElementById("userEmailBtn");

userEmailBtn.addEventListener("mouseover", () => {
    const userEmailBtnValue = document.getElementById("userEmailInput").value;
    userEmailBtn.href = `/api/users/toggle-role/${userEmailBtnValue}`
});