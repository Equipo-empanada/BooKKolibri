document.addEventListener('DOMContentLoaded', function () {
    const cardField = document.getElementById('card-field');
    const creditCardLogos = document.querySelectorAll('.credit_card_logo');
    const purchasedProductsContainer = document.querySelector('.purcharsed_products');
    const paymentButton = document.querySelector('.payment_button');
    const subtotalElement = document.querySelector('.payment_summary__total .price');
    const totalElement = document.querySelector('.total_price .price');
    const serviceFee = 1.5; // Tarifa de servicio
    let subtotal = 0;
    let shoppingCart = JSON.parse(localStorage.getItem('shopping_cart')) || [];

    // Function to update card logo
    function updateCardLogo(cardNumber) {
        const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
        const masterCardRegex = /^5[1-5][0-9]{14}$/;
        const dinersRegex = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;

        creditCardLogos.forEach(logo => logo.style.display = 'none'); // Hide all logos

        if (visaRegex.test(cardNumber)) {
            document.querySelector('img[alt="Visa"]').style.display = 'block';
        } else if (masterCardRegex.test(cardNumber)) {
            document.querySelector('img[alt="Mastercard"]').style.display = 'block';
        } else if (dinersRegex.test(cardNumber)) {
            document.querySelector('img[alt="Diners Club"]').style.display = 'block';
        }
    }

    // Event listener for card number input
    cardField.addEventListener('input', function (e) {
        const cardNumber = e.target.value.replace(/\s+/g, ''); // Remove spaces
        updateCardLogo(cardNumber);
    });

    // Function to load shopping cart items
    function loadShoppingCart() {
        shoppingCart.forEach(item => {
            const itemPrice = parseFloat(item.price.replace('US$', '').replace('&nbsp;', '').trim());
            subtotal += itemPrice;
            const productHTML = `
                <li class="product" data-id="${item.id}">
                    <div class="product_store">
                        <div class="product_store_info">
                            <div>
                                <img src="${item.img}" alt="Logo de la tienda" class="store_logo">
                            </div>
                            <div class="store_name_container">
                                <div class="store_name_info">
                                    <span class="store_name" tabindex="-1">${item.seller}</span>
                                </div>
                                <div class="LevzSC"></div>
                            </div>
                        </div>
                    </div>
                    <img src="${item.img}" alt="Imagen del producto" class="product_image">
                    <span class="product_name">${item.booktitle}</span>
                    <div>
                        <span class="product_status">${item.state}</span>
                    </div>
                    <div class="product_price">
                        
                        <div class="product_price_text">
                            <strong>
                                <span class="price">${item.price}</span>
                            </strong>
                        </div>
                    </div>
                    <button class="remove_product" type="button">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5px" class=""
                                style="max-width: 16px; min-width: 16px; height: auto;">
                                <g>
                                    <line x1="1" y1="5" x2="23" y2="5" fill="none" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round"></line>
                                    <path d="M14.25,1H9.75a1.5,1.5,0,0,0-1.5,1.5V5h7.5V2.5A1.5,1.5,0,0,0,14.25,1Z" fill="none" stroke="currentColor"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                    <line x1="9.75" y1="17.75" x2="9.75" y2="10.25" fill="none" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round"></line>
                                    <line x1="14.25" y1="17.75" x2="14.25" y2="10.25" fill="none" stroke="currentColor" stroke-linecap="round"
                                        stroke-linejoin="round"></line>
                                    <path d="M18.86,21.62A1.49,1.49,0,0,1,17.37,23H6.63a1.49,1.49,0,0,1-1.49-1.38L3.75,5h16.5Z" fill="none"
                                        stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                </g>
                            </svg>
                        </span>
                    </button>
                </li>
            `;
            purchasedProductsContainer.insertAdjacentHTML('beforeend', productHTML);
        });
        updateTotals();
    }

    // Function to update subtotal and total
    function updateTotals() {
        const total = subtotal + serviceFee;
        subtotalElement.textContent = `${subtotal.toFixed(2)} US$`;
        totalElement.textContent = `${total.toFixed(2)} US$`;
    }

    // Function to remove product
    function removeProduct(productId) {
        const productElement = document.querySelector(`li[data-id="${productId}"]`);
        if (productElement) {
            const productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('US$', '').replace('&nbsp;', '').trim());
            subtotal -= productPrice;
            productElement.remove();
            // Remove product from shoppingCart and localStorage
            shoppingCart = shoppingCart.filter(item => item.id !== productId);
            localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart));
            updateTotals();
        }
    }

    // Function to show loading and success message
    function showPaymentProcessing() {
        Swal.fire({
            title: 'Procesando pago...',
            text: 'Por favor, espera mientras procesamos tu pago.',
            icon: 'info',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Simulate payment processing
        setTimeout(() => {
            Swal.fire({
                title: 'Transacción exitosa',
                text: 'Tu pago se ha realizado con éxito.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }, 3000);
    }

    // Event listener for payment button
    paymentButton.addEventListener('click', function (e) {
        e.preventDefault();
        showPaymentProcessing();
    });

    // Event listener for remove product buttons
    purchasedProductsContainer.addEventListener('click', function (e) {
        if (e.target.closest('.remove_product')) {
            const productId = e.target.closest('.product').getAttribute('data-id');
            removeProduct(productId);
        }
    });

    // Load shopping cart on page load
    loadShoppingCart();
});
