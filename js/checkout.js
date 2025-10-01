// js/checkout.js

// Instancia global del carrito (asume que cart.js ya la definió)
// Si no está definida, descomente la siguiente línea o asegúrese de que la clase Cart esté disponible.
// const cart = new Cart(); 

let subtotal = 0;
let shippingCost = 1200; // Costo inicial (Envío Estándar a Domicilio)
let packagingCost = 0;

function formatPrice(price) {
    if (typeof price !== 'number' || isNaN(price)) return '$0';
    return `$${price.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// ----------------------------------------------------
// FUNCIÓN FALTANTE: Guardar en Historial de Compras
// ----------------------------------------------------

function saveToPurchaseHistory(orderData) {
    // Historial: obtenemos array previo o vacío
    let history = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
    history.push(orderData);
    localStorage.setItem("purchaseHistory", JSON.stringify(history));
    console.log(`[Checkout] Pedido #${orderData.orderId} guardado en el historial de ${orderData.userEmail}.`);
}

// ----------------------------------------------------
// 1. LÓGICA DE ACTUALIZACIÓN DE RESUMEN
// ----------------------------------------------------

function updateSummary() {
    const total = subtotal + shippingCost + packagingCost;
    
    document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkout-packaging-cost').textContent = formatPrice(packagingCost);
    document.getElementById('checkout-shipping-cost').textContent = formatPrice(shippingCost);
    document.getElementById('checkout-total').textContent = formatPrice(total);
}

function handleShippingChange(e) {
    shippingCost = parseInt(e.target.dataset.cost) || 0;
    updateSummary();
}

function handlePackagingChange(e) {
    packagingCost = e.target.checked ? 300 : 0; // Costo de empaque ecológico
    updateSummary();
}

function generateReceipt(orderData) {
    // Generación de HTML simple para el recibo (ejemplo)
    let itemsHtml = orderData.items.map(item => 
        `<li>${item.qty} x ${item.name} - ${formatPrice(item.price)} c/u</li>`
    ).join('');

    return `
        <h2>Comprobante de Compra #${orderData.orderId}</h2>
        <p><strong>Fecha:</strong> ${orderData.date}</p>
        <p><strong>Cliente:</strong> ${orderData.userEmail}</p>
        
        <h3>Detalle del Pedido</h3>
        <ul>${itemsHtml}</ul>
        
        <p><strong>Subtotal:</strong> ${formatPrice(orderData.subtotal)}</p>
        <p><strong>Costo de Envío:</strong> ${formatPrice(orderData.shippingCost)} (${orderData.shippingMethod})</p>
        <p><strong>Costo de Empaque:</strong> ${formatPrice(orderData.packagingCost)}</p>
        
        <p><strong>Método de Pago:</strong> ${orderData.paymentMethodName}</p>
        
        <hr/>
        <h3>TOTAL FINAL: ${formatPrice(orderData.total)}</h3>
    `;
}

// ----------------------------------------------------
// 2. LÓGICA DE INICIALIZACIÓN Y PROCESO DE PAGO
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificar sesión
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        alert("Debes iniciar sesión para finalizar tu compra.");
        window.location.href = "login.html";
        return;
    }

    // 2. Cargar carrito y verificar que no esté vacío
    if (typeof cart === 'undefined' || cart.items.length === 0) {
        document.querySelector('.checkout-options-container').innerHTML = `
            <h2>Carrito Vacío</h2>
            <p>Tu carrito está vacío. <a href="catalog.html">¡Vuelve al catálogo para comprar!</a></p>
        `;
        document.querySelector('.cart-summary-container').style.display = 'none';
        return;
    }
    
    // 3. Obtener subtotal
    subtotal = cart.getTotal();
    
    // 4. Configurar listeners de cambios
    document.querySelectorAll('input[name="shipping"]').forEach(input => {
        input.addEventListener('change', handleShippingChange);
        // Seleccionar el primero por defecto y establecer el costo inicial
        if(input.value === 'domicilio') {
            input.checked = true;
            shippingCost = parseInt(input.dataset.cost) || 0;
        }
    });

    document.querySelectorAll('input[name="packaging"]').forEach(input => {
        input.addEventListener('change', handlePackagingChange);
    });
    
    // 5. Renderizar resumen inicial
    updateSummary();

    // 6. Listener del botón de compra
    const finalizeBtn = document.getElementById('finalize-purchase-btn');
    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', () => {
            const selectedShipping = document.querySelector('input[name="shipping"]:checked');
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            
            if (!selectedShipping) {
                alert("Por favor, selecciona una opción de envío.");
                return;
            }
            if (!selectedPayment) {
                alert("Por favor, selecciona un método de pago.");
                return;
            }

            // Simulación de proceso de pago (en un entorno real aquí se integraría una pasarela)
            const paymentMethod = selectedPayment.value;
            const paymentMethodName = selectedPayment.parentNode.querySelector('.payment-label').textContent;
            
            // Simulación de validación (ejemplo: si es transferencia, 10% de probabilidad de fallo)
            if (paymentMethod === 'transferencia' && Math.random() < 0.1) {
                alert("Simulación de pago fallida por error bancario. Compra cancelada.");
                return;
            }

            // Si la simulación es exitosa:
            const totalFinal = subtotal + shippingCost + packagingCost;

            const orderData = {
                orderId: Math.floor(100000 + Math.random() * 900000), // ID de 6 dígitos
                userEmail: currentUser.email,
                date: new Date().toLocaleString('es-AR'),
                items: [...cart.items], // Copia profunda de los items del carrito
                subtotal: subtotal,
                shippingMethod: selectedShipping.parentNode.querySelector('.shipping-label').textContent,
                shippingCost: shippingCost,
                packagingCost: packagingCost,
                paymentMethod: paymentMethod, // mp, tarjeta, transferencia
                paymentMethodName: paymentMethodName, // Nombre visible
                total: totalFinal
            };
            
            // 1. Guardar en historial
            saveToPurchaseHistory(orderData);
            
            // 2. Generar comprobante (y mostrar en un entorno de confirmación real)
            const receiptHtml = generateReceipt(orderData);
            
            // 3. Limpiar carrito
            cart.clear(); 
            
            // 4. Redirigir al historial para ver la compra reciente
            alert(`¡Compra #${orderData.orderId} exitosa! Puedes ver el comprobante en tu Historial.`);
            // Almacenar el comprobante en localStorage temporalmente para mostrarlo en history.html si desea.
            localStorage.setItem('last_receipt', receiptHtml); 

            window.location.href = "history.html";
        });
    }

});