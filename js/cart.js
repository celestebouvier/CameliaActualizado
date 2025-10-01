// js/cart.js

/**
 * Clase para manejar la lógica del carrito de compras.
 * Persiste los datos en localStorage bajo la clave "cartItems".
 */
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem("cartItems")) || [];
        this.updateCartCount();
    }

    save() {
        localStorage.setItem("cartItems", JSON.stringify(this.items));
    }

    // Método para sumar la cantidad total de unidades en el carrito
    getTotalItemsCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    // Actualiza el contador visible del carrito en la interfaz
    updateCartCount() {
        const countEl = document.getElementById("cart-count");
        if (countEl) {
            countEl.textContent = this.getTotalItemsCount();
            countEl.style.display = this.items.length > 0 ? "flex" : "none";
        }
    }

    add(product, qty = 1) {
        // Validación de sesión (usando lógica de auth.js)
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
            existing.qty = Math.max(1, (existing.qty || 0) + qty);
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                qty: Math.max(1, qty), // Asegura que la cantidad sea al menos 1
                // Propiedades adicionales necesarias para la visualización del carrito/historial
                age: product.age,
                category: product.category 
            });
        }

        this.save();
        this.updateCartCount();
        alert(`"${product.name}" agregado al carrito (${Math.max(1, qty)} unidad/es)`);
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

    // Calcula el subtotal (antes de costos de envío/extras)
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.qty), 0);
    }
}

// Inicializa el carrito global
const cart = new Cart();

// Función de ayuda para formatear precios (Asumiendo pesos argentinos ARS)
function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) return '$0';
    // Utiliza el formato de moneda argentina (pesos)
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}


/**
 * Renderiza el contenido del carrito en la página cart.html
 */
function renderCart() {
    const cartListEl = document.getElementById('cart-list');
    const items = cart.items;
    
    if (!cartListEl) return;

    cartListEl.innerHTML = '';
    const emptyMessage = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Elementos de Resumen
    const subtotalEl = document.getElementById('summary-subtotal');
    const totalProductsEl = document.getElementById('summary-total-products');
    const totalEl = document.getElementById('summary-total');

    if (items.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (checkoutBtn) checkoutBtn.disabled = true;
        
        // Actualizar resumen a 0
        if (subtotalEl) subtotalEl.textContent = formatPrice(0);
        if (totalProductsEl) totalProductsEl.textContent = 0;
        if (totalEl) totalEl.textContent = formatPrice(0);
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    if (checkoutBtn) checkoutBtn.disabled = false;

    // Renderizar Productos
    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        
        itemEl.innerHTML = `
            <img src="img/${item.img}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>${item.category}</p>
            </div>
            <div class="cart-item-quantity">
                <input type="number" 
                       class="qty-input" 
                       value="${item.qty}" 
                       min="1" 
                       max="99"
                       data-index="${index}">
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
            <button class="remove-btn" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartListEl.appendChild(itemEl);
    });

    // Eventos de Cantidad
    cartListEl.querySelectorAll('.qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            let newQty = parseInt(e.target.value, 10) || 1;
            
            cart.updateQuantity(index, newQty);
            renderCart(); // Vuelve a renderizar para actualizar totales
        });
    });

    // Eventos de Eliminar
    // Usamos e.currentTarget para asegurarnos de que el listener esté en el botón
    cartListEl.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.currentTarget.dataset.index, 10);
            cart.remove(index);
            renderCart(); // Vuelve a renderizar para actualizar totales
        });
    });
    
    // Actualizar Resumen
    const subtotal = cart.getTotal();
    const totalProducts = cart.getTotalItemsCount();
    
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (totalEl) totalEl.textContent = formatPrice(subtotal); // Total inicial = Subtotal
}


// LÓGICA DE INICIALIZACIÓN Y CHECKOUT
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en cart.html, cargamos y renderizamos el carrito
    if (window.location.pathname.includes('cart.html')) {
        renderCart(); 

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                const currentUser = JSON.parse(localStorage.getItem("currentUser"));
                
                if (!currentUser) {
                    alert("Debes iniciar sesión para confirmar tu compra.");
                    window.location.href = "login.html";
                    return;
                }
                
                if (cart.items.length > 0) {
                    // **REDIRECCIÓN AL NUEVO PROCESO DE PAGO**
                    window.location.href = 'checkout.html';
                } else {
                    alert("Tu carrito está vacío.");
                }
            });
        }
    }
});