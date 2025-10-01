class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem("cartItems")) || [];
    this.updateCartCount();
  }

  save() {
    localStorage.setItem("cartItems", JSON.stringify(this.items));
  }

  add(product, qty = 1) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      window.location.href = "login.html";
      return;
    }

    if (!product.stock) {
        alert(`Lo sentimos, el producto "${product.name}" está agotado.`);
        return;
    }

    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 0) + qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: qty,
        age: product.age,
        category: product.category
      });
    }

    this.save();
    this.updateCartCount();
    alert("Producto agregado al carrito");
  }

  remove(index) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.save();
      this.updateCartCount();
    }
  }

  updateQuantity(index, qty) {
    if (this.items[index]) {
      this.items[index].qty = Math.max(1, parseInt(qty, 10) || 1);
      this.save();
      this.updateCartCount();
    }
  }

  clear() {
    this.items = [];
    localStorage.removeItem("cartItems");
    this.updateCartCount();
  }

  getTotal() {
    return this.items.reduce((acc, it) => acc + (it.price * (it.qty || 1)), 0);
  }

  updateCartCount() {
    const countEl = document.getElementById("cart-count") || document.querySelector(".cart-count");
    const totalQty = this.items.reduce((s, it) => s + (it.qty || 0), 0);
    if (countEl) {
      countEl.textContent = totalQty;
      countEl.style.display = totalQty > 0 ? "flex" : "none";
    }
  }
}

window.cart = new Cart();
