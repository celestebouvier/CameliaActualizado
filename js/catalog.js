let allProducts = [];
const itemsPerPage = 6;
let currentPage = 1;

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderProducts(products, page = 1) {
  const list = document.getElementById("catalog-list");
  if (!list) return;

  list.innerHTML = "";

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = products.slice(start, end);

  if (paginated.length === 0) {
    list.innerHTML = "<p>No encontramos productos con esos filtros.</p>";
    return;
  }

  paginated.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    // link wrapper
    const link = document.createElement("a");
    link.className = "product-link";
    link.href = `product.html?id=${p.id}`;

    const img = document.createElement("img");
    img.src = `img/${p.img}`;
    img.alt = p.name;
    img.className = "product-img";

    const title = document.createElement("h3");
    title.textContent = p.name;

    link.appendChild(img);
    link.appendChild(title);

    const price = document.createElement("p");
    price.innerHTML = `<strong>$${p.price}</strong>`;

    const buyBtn = document.createElement("button");
    buyBtn.className = "buy-btn";
    buyBtn.textContent = "🛒 Agregar";

    buyBtn.addEventListener("click", (e) => {
      e.preventDefault(); // evitar que el click del botón siga el link
      cart.add(p, 1);
    });

    card.appendChild(link);
    card.appendChild(price);
    card.appendChild(buyBtn);
    list.appendChild(card);
  });

  renderPagination(products, page);
}

function renderPagination(products, page) {
  const paginationEl = document.getElementById("pagination");
  if (!paginationEl) return;

  paginationEl.innerHTML = "";

  const totalPages = Math.ceil(products.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === page) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts(products, currentPage);
    });
    paginationEl.appendChild(btn);
  }
}

function applyFilters() {
  const ageEl = document.getElementById("filter-age");
  const typeEl = document.getElementById("filter-type");
  const characterEl = document.getElementById("filter-character");
  const age = ageEl ? ageEl.value : "";
  const type = typeEl ? typeEl.value : "";
  const character = characterEl ? characterEl.value : "";

  let filtered = allProducts.filter(
    p =>
      (!age || p.age === age) &&
      (!type || p.category === type) &&
      (!character || p.character === character)
  );

  currentPage = 1;
  renderProducts(filtered, currentPage);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/products.json")
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      renderProducts(allProducts, currentPage);
    })
    .catch(err => {
      console.error("Error cargando productos:", err);
    });

  const ageEl = document.getElementById("filter-age");
  const typeEl = document.getElementById("filter-type");
  const characterEl = document.getElementById("filter-character");
  const resetBtn = document.getElementById("reset-filters");

  if (ageEl) ageEl.addEventListener("change", applyFilters);
  if (typeEl) typeEl.addEventListener("change", applyFilters);
  if (characterEl) characterEl.addEventListener("change", applyFilters);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (ageEl) ageEl.value = "";
      if (typeEl) typeEl.value = "";
      if (characterEl) characterEl.value = "";
      currentPage = 1;
      renderProducts(allProducts, currentPage);
    });
  }
});


