document.addEventListener('DOMContentLoaded', function () {
    const cardField = document.getElementById('card-field');
    const creditCardLogos = document.querySelectorAll('.credit_card_logo');
    const purchasedProductsContainer = document.querySelector('.purcharsed_products');
    const paymentButton = document.querySelector('.payment_button');
    const subtotalElement = document.querySelector('.payment_summary__total .price');
    const totalElement = document.querySelector('.total_price .price');
    const countrySelect = document.getElementById('country-select');
    const cities = document.getElementById('city-select');
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

        /**
     * Set the cities of the country
     * @param {string} country 
     */
    function setcities(event){
        //Enable the cities select
        cities.disabled = false;
        const country = event.target.options[event.target.selectedIndex].text;
        console.log(country);
        if (country === '' || country === null || country === undefined) {
            return;
        }

        const endpoint = 'https://countriesnow.space/api/v0.1/countries/cities';
        console.log(country);

        const body_json = {
            country: country
        };

        const headers = {
            'Content-Type': 'application/json'
        };

        fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body_json)
        })
        .then(response => response.json())
        .then(data => {
            cities.innerHTML = '';
            data.data.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.text = city;
                cities.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    // Function to update totals
    function updateTotals() {
        const total = subtotal + serviceFee;
        subtotalElement.innerHTML = `${subtotal.toFixed(2)}&nbsp;US$`;
        totalElement.innerHTML = `${total.toFixed(2)}&nbsp;US$`;
    }

    // Event listener for remove product button
    purchasedProductsContainer.addEventListener('click', function (e) {
        if (e.target.closest('.remove_product')) {
            const productElement = e.target.closest('.product');
            const productId = productElement.getAttribute('data-id');
            const productPrice = parseFloat(productElement.querySelector('.price').innerHTML.replace('US$', '').replace('&nbsp;', '').trim());

            // Remove product from shopping cart array
            shoppingCart = shoppingCart.filter(item => item.id !== productId);
            localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart));

            // Remove product element from DOM
            productElement.remove();

            // Update subtotal and totals
            subtotal -= productPrice;
            updateTotals();
        }
    });

    // Fetch and populate countries
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort countries alphabetically
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca2; // Use country code as value
                option.textContent = country.name.common;
                countrySelect.appendChild(option);
            });
        });

    // Event listener for country selection
    countrySelect.addEventListener('change', setcities);

// Event listener for payment button
paymentButton.addEventListener('click', function (e) {
    e.preventDefault();
    Swal.fire({
        title: 'Realizando pago...',
        text: 'Por favor, espera mientras procesamos tu transacción.',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
            // Create purchase record
            fetch('/register_purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: shoppingCart
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Transacción exitosa',
                        text: 'Tu pago ha sido procesado con éxito.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Clear shopping cart and localStorage
                        shoppingCart = [];
                        localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart));
                        // Redirect to a confirmation page or reset the form
                        window.location.href = '/'; // Example URL
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema procesando tu transacción.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
});

    // Load shopping cart on page load
    loadShoppingCart();
});
