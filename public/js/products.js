const etiquetaAdmin = document.getElementById("role")
const textoRole = etiquetaAdmin.textContent

const etiquetaMyCart = document.getElementById("cart")
const etiquetaAgregar = document.getElementsByClassName("addToCartBtn")

console.log(etiquetaAgregar)

document.addEventListener("DOMContentLoaded", async () => {
  console.log(textoRole)
  if (textoRole === `Role: admin`) {
    etiquetaMyCart.removeAttribute("href")
    etiquetaMyCart.setAttribute("description", "ADMINs can not buy!")
    etiquetaMyCart.style.display = "flex";
    etiquetaMyCart.style.flexDirection = "row";
    etiquetaMyCart.style.columnGap = "5px";
    etiquetaMyCart.style.alignItems = "center";
    etiquetaMyCart.style.textDecoration = "none";
    etiquetaMyCart.style.backgroundColor = "#707070";
    etiquetaMyCart.style.width = "auto";
    etiquetaMyCart.style.padding = "8px 15px 8px 15px";
    etiquetaMyCart.style.borderRadius = "5px";
    etiquetaMyCart.style.transition = "1s";
    etiquetaMyCart.style.filter = "blur(.2)"
    etiquetaMyCart.style.filter = "contrast(.2)"
    etiquetaMyCart.style.cursor = "default"

    for(let i = 0; i < etiquetaAgregar.length; i++) {
      etiquetaAgregar[i].disabled = true
      etiquetaAgregar[i].setAttribute("title", "ADMINs can not buy!")
      etiquetaAgregar[i].style.display = "flex";
      etiquetaAgregar[i].style.flexDirection = "row";
      etiquetaAgregar[i].style.columnGap = "5px";
      etiquetaAgregar[i].style.alignItems = "center";
      etiquetaAgregar[i].style.textDecoration = "none";
      etiquetaAgregar[i].style.backgroundColor = "#707070";
      etiquetaAgregar[i].style.width = "auto";
      etiquetaAgregar[i].style.padding = "8px 15px 8px 15px";
      etiquetaAgregar[i].style.borderRadius = "5px";
      etiquetaAgregar[i].style.transition = "1s";
      etiquetaAgregar[i].style.filter = "blur(.2)"
      etiquetaAgregar[i].style.filter = "contrast(.2)"
      etiquetaAgregar[i].style.cursor = "default"
    }
  }
})