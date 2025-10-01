// js/product.js
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));

  if (!productId) {
    document.getElementById("product-info").innerHTML = "<p>Producto no especificado.</p>";
    return;
  }

  fetch("data/products.json")
    .then(res => res.json())
    .then(products => {
      const product = products.find(p => p.id === productId);
      if (!product) {
        document.getElementById("product-info").innerHTML = "<p>Producto no encontrado.</p>";
        return;
      }

      // Imagen principal
      const mainImg = document.getElementById("main-img");
      mainImg.src = "img/" + product.img;
      mainImg.alt = product.name;

      // Thumbs (vertical)
      const thumbsEl = document.getElementById("thumbs");
      thumbsEl.innerHTML = "";
      // Primero añade la imagen principal como thumb pequeña también
      const mainThumb = document.createElement("img");
      mainThumb.src = "img/" + product.img;
      mainThumb.alt = product.name;
      mainThumb.addEventListener("click", () => { mainImg.src = mainThumb.src; });
      thumbsEl.appendChild(mainThumb);

      if (product.extraImages && product.extraImages.length > 0) {
        product.extraImages.forEach(img => {
          const thumb = document.createElement("img");
          thumb.src = "img/" + img;
          thumb.alt = product.name;
          thumb.addEventListener("click", () => {
            mainImg.src = thumb.src;
          });
          thumbsEl.appendChild(thumb);
        });
      }

      // Info a la derecha con selector de cantidad
      const infoEl = document.getElementById("product-info");
      infoEl.innerHTML = ""; // limpio y creo nodos para evitar XSS inadvertido

      const title = document.createElement("h2");
      title.textContent = product.name;

      const desc = document.createElement("p");
      desc.textContent = product.description;

      const price = document.createElement("p");
      price.innerHTML = `<strong>Precio:</strong> $${product.price}`;

      const stock = document.createElement("p");
      stock.innerHTML = `<strong>Stock:</strong> ${product.stock}`;

      const age = document.createElement("p");
      age.innerHTML = `<strong>Edad recomendada:</strong> ${product.age}`;

      const category = document.createElement("p");
      category.innerHTML = `<strong>Categoría:</strong> ${product.category}`;

      const character = document.createElement("p");
      character.innerHTML = `<strong>Personaje:</strong> ${product.character || "N/A"}`;

      const dims = document.createElement("p");
      dims.innerHTML = `<strong>Dimensiones:</strong> ${product.height}cm x ${product.width}cm`;

      const weight = document.createElement("p");
      weight.innerHTML = `<strong>Peso:</strong> ${product.weight} g`;

      // quantity selector
      const qtyWrap = document.createElement("div");
      qtyWrap.style.marginTop = "12px";
      qtyWrap.innerHTML = `
        <label for="qty">Cantidad:</label>
        <input type="number" id="qty" name="qty" min="1" max="10" value="1" style="width:80px; margin-left:8px; padding:6px; border-radius:6px;"/>
      `;

      const buyBtn = document.createElement("button");
      buyBtn.className = "buy-btn";
      buyBtn.textContent = "Agregar al carrito";

      infoEl.appendChild(title);
      infoEl.appendChild(desc);
      infoEl.appendChild(price);
      infoEl.appendChild(stock);
      infoEl.appendChild(age);
      infoEl.appendChild(category);
      infoEl.appendChild(character);
      infoEl.appendChild(dims);
      infoEl.appendChild(weight);
      infoEl.appendChild(qtyWrap);
      infoEl.appendChild(buyBtn);

      buyBtn.addEventListener("click", () => {
        const qtyInput = document.getElementById("qty");
        const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
        cart.add(product, qty);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("product-info").innerHTML = "<p>Error cargando producto.</p>";
    });
});


